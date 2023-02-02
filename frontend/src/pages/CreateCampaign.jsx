import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ethers } from 'ethers';

import { useStateContext } from '../context';
import { money } from '../assets';
import { CustomButton, FormField, Loader } from '../components';
import { checkIfImage } from '../utils';
import * as PushAPI from '@pushprotocol/restapi';

const PK = '8665ed6c0de68518c0676ba29b5868a5020007151d6c91d7614a5b8e2a576ba8'; // channel private key
const Pkey = `0x${PK}`;
const signer = new ethers.Wallet(Pkey);

// apiResponse?.status === 204, if sent successfully!
// async function apiResponse() {
//   await PushAPI.payloads.sendNotification({
//     signer,
//     type: 1, // broadcast
//     identityType: 2, // direct payload
//     notification: {
//       title: `[SDK-TEST] notification TITLE:`,
//       body: `[sdk-test] notification BODY`,
//     },
//     payload: {
//       title: `[sdk-test] payload title`,
//       body: `sample msg body`,
//       cta: '',
//       img: '',
//     },
//     channel: 'eip155:80001:0xFFd01a76cA473B48431E27Ab36f61a764270238F', // your channel address
//     env: 'staging',
//   });
//   console.log('DONE');
// }

const CreateCampaign = () => {
  const sendNotification = async () => {
    try {
      const apiResponse = await PushAPI.payloads.sendNotification({
        signer,
        type: 1, // broadcast
        identityType: 2, // direct payload
        notification: {
          title: `Donate to newCampaign`,
          body: `Campaign-${form.title} created!!`,
        },
        payload: {
          title: `Donate`,
          body: `New Campaign-${form.title} created!!`,
          cta: '',
          img: '',
        },
        channel: 'eip155:5:0xFFd01a76cA473B48431E27Ab36f61a764270238F', // your channel address
        env: 'staging',
      });

      // apiResponse?.status === 204, if sent successfully!
      console.log('API repsonse: ', apiResponse);
    } catch (err) {
      console.error('Error: ', err);
    }
  };

  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { createCampaign } = useStateContext();
  const [form, setForm] = useState({
    name: '',
    title: '',
    description: '',
    target: '',
    deadline: '',
    image: '',
  });

  const handleFormFieldChange = (fieldName, e) => {
    setForm({ ...form, [fieldName]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    checkIfImage(form.image, async (exists) => {
      if (exists) {
        setIsLoading(true);
        await createCampaign({ ...form, target: ethers.utils.parseUnits(form.target, 18) });
        setIsLoading(false);
        sendNotification;
        navigate('/');
      } else {
        alert('Provide valid image URL');
        setForm({ ...form, image: '' });
      }
    });
  };

  return (
    <div className="bg-secondary flex justify-center items-center flex-col rounded-[10px] sm:p-10 p-4">
      {isLoading && <Loader />}
      <div className="flex justify-center items-center p-[16px] sm:min-w-[380px] bg-button rounded-[10px]">
        <h1 className="font-epilogue font-bold sm:text-[25px] text-[18px] leading-[38px] text-white">
          Start a Campaign
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="w-full mt-[65px] flex flex-col gap-[30px]">
        <div className="flex flex-wrap gap-[40px]">
          <FormField
            labelName="Your Name *"
            placeholder="John Doe"
            inputType="text"
            value={form.name}
            handleChange={(e) => handleFormFieldChange('name', e)}
          />
          <FormField
            labelName="Campaign Title *"
            placeholder="Write a title"
            inputType="text"
            value={form.title}
            handleChange={(e) => handleFormFieldChange('title', e)}
          />
        </div>

        <FormField
          labelName="Story *"
          placeholder="Write your story"
          isTextArea
          value={form.description}
          handleChange={(e) => handleFormFieldChange('description', e)}
        />

        <div className="w-full flex justify-start items-center p-4 bg-[#8c6dfd] h-[120px] rounded-[10px]">
          <img src={money} alt="money" className="w-[40px] h-[40px] object-contain" />
          <h4 className="font-epilogue font-bold text-[25px] text-white ml-[20px]">
            You will get 100% of the raised amount
          </h4>
        </div>

        <div className="flex flex-wrap gap-[40px]">
          <FormField
            labelName="Goal *"
            placeholder="ETH 0.50"
            inputType="text"
            value={form.target}
            handleChange={(e) => handleFormFieldChange('target', e)}
          />
          <FormField
            labelName="End Date *"
            placeholder="End Date"
            inputType="date"
            value={form.deadline}
            handleChange={(e) => handleFormFieldChange('deadline', e)}
          />
        </div>

        <FormField
          labelName="Campaign image *"
          placeholder="Place image URL of your campaign"
          inputType="url"
          value={form.image}
          handleChange={(e) => handleFormFieldChange('image', e)}
        />

        <div className="flex justify-center items-center mt-[40px]">
          <CustomButton btnType="submit" title="Submit new campaign" styles="bg-[#1dc071]" />
        </div>
      </form>
      {/* <button className="mt-20" onClick={sendNotification}>
        Send Notif
      </button> */}
    </div>
  );
};

export default CreateCampaign;
