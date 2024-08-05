import React, { useState, useEffect } from 'react';
import { IoArrowBack } from "react-icons/io5";
import { useDispatch, useSelector } from 'react-redux';
import { setShowProfile } from '../redux/profileSlice';
import { IoMdLogOut } from "react-icons/io";
import InputEdit from './profile/InputEdit';
import { updateUser, uploadProfilePicture } from '../apis/auth';
import { toast } from 'react-toastify';
import { setUserNameAndBio } from '../redux/activeUserSlice';

function Profile(props) {
  const dispatch = useDispatch();
  const { showProfile } = useSelector((state) => state.profile);
  const activeUser = useSelector((state) => state.activeUser);
  const [formData, setFormData] = useState({
    name: activeUser.name || '',
    bio: activeUser.bio || '',
  });
  const [profilePic, setProfilePic] = useState(activeUser.profilePic || '');

  useEffect(() => {
    setProfilePic(activeUser.profilePic || '');
  }, [activeUser.profilePic]);

  const logoutUser = () => {
    toast.success("Logout Successful!");
    localStorage.removeItem("userToken");
    window.location.href = "/login";
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePic(URL.createObjectURL(file));
      handleProfilePicSubmit(file);
    }
  };

  const handleProfilePicSubmit = async (file) => {
    const formData = new FormData();
    formData.append('profilePic', file);

    try {
      const response = await uploadProfilePicture(formData);
      if (response && response.filePath) {
        toast.success("Profile Picture Updated!");
        dispatch(setUserNameAndBio({ profilePic: response.filePath }));
      } else {
        toast.error("Error uploading profile picture.");
      }
    } catch (error) {
      toast.error("Error uploading profile picture.");
      console.error("Error uploading profile picture:", error);
    }
  };

  const submit = async () => {
    try {
      await updateUser(activeUser.id, formData);
      dispatch(setUserNameAndBio(formData));
      toast.success("Profile Updated!");
    } catch (error) {
      toast.error("Error updating profile.");
      console.error("Error updating profile:", error);
    }
  };

  return (
    <div style={{ transition: showProfile ? "0.3s ease-in-out" : "" }} className={props.className}>
      <div className='absolute w-[100%]'>
        <div className='bg-[#166e48] pt-12 pb-3'>
          <button onClick={() => dispatch(setShowProfile(false))} className='flex items-center'>
            <IoArrowBack style={{ color: "#fff", width: "30px", height: "20px" }} />
            <h6 className='text-[16px] text-[#fff] font-semibold'>Profile</h6>
          </button>
        </div>
        <div className='pt-5'>
          <div className='flex items-center flex-col'>
            <input 
              type="file" 
              id="profilePicInput" 
              style={{ display: 'none' }} 
              onChange={handleProfilePicChange} 
            />
            <img 
              className='w-[150px] h-[150px] rounded-[100%] -ml-5 cursor-pointer' 
              src={profilePic || activeUser.profilePic || 'default_profile_pic_url'} 
              alt="Profile" 
              onClick={() => document.getElementById('profilePicInput').click()} 
            />
          </div>
          <InputEdit type="name" handleChange={handleChange} input={formData.name} handleSubmit={submit} />
          <div className='py-5 px-4'>
            <p className='text-[10px] tracking-wide text-[#3b4a54]'>
              This is not your username or pin. This name will be visible to your contacts.
            </p>
          </div>
          <InputEdit type="bio" handleChange={handleChange} input={formData.bio} handleSubmit={submit} />
        </div>
        <div onClick={logoutUser} className='flex items-center justify-center mt-5 cursor-pointer shadow-2xl'>
          <IoMdLogOut className='text-[#e44d4d] w-[27px] h-[23px]' />
          <h6 className='text-[17px] text-[#e44d4d] font-semibold'>Logout</h6>
        </div>
      </div>
    </div>
  );
}

export default Profile;
