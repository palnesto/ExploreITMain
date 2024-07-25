import { useRef, useState } from 'react';
import { LuImagePlus } from 'react-icons/lu';
import { RxCross2 } from 'react-icons/rx';
import PropTypes from 'prop-types';
import axios from 'axios';
import { API_BASE_URL } from '../../config';
import { toast } from 'react-toastify';

const Blogpopup = ({ onClose, onSubmit, initialData, onDelete }) => {
    const [heading, setHeading] = useState(initialData?.BlogName || '');
    const [description, setDescription] = useState(initialData?.servDescription || '');
    const [image, setImage] = useState(initialData?.photo1 || null);

    const maxDescriptionLength = 600;
    const fileInputRef = useRef(null);
    const handleImageUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) {
            console.error("No file selected.");
            return;
        }

        const formData = new FormData();
        formData.append("image", file);

        try {
            const response = await axios.post(`${API_BASE_URL}/V1/blogImg`, formData);
            const newImageUrl = response.data.imageUrl;
            if (newImageUrl) {
                toast.success("Image uploaded successfully");
                setImage(newImageUrl); // Update the state with the URL from AWS
            } else {
                console.error("Failed to upload image. No URL returned from the server.");
            }
        } catch (error) {
            console.error("Error uploading image: ", error);
            toast.error("Failed to upload image");
        }
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        const data = {
            BlogName: heading,
            servDescription: description,
            photo1: image,
            Active: initialData?.Active || false,
        };
        onSubmit(data);
    };

    const handleDelete = () => {
        onDelete(initialData);
    };


    const handleImageUploadClick = () => {
        fileInputRef.current.click();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black bg-opacity-50 backdrop-blur">
            <div className="h-full p-10 bg-white rounded-lg shadow-lg 2xl:w-1/2 3xl:w-1/2 lg:w-3/4 ">
                <div className='flex flex-row items-center justify-between'>
                    <h1 className="mt-0 mb-4 text-2xl font-bold text-start">{initialData ? 'Edit Blog' : 'New Blog'}</h1>
                    <RxCross2 className='cursor-pointer' size={32} onClick={onClose} />
                </div>
                <div className='flex flex-col'>
                    <div>
                        <h1 className="mt-0 mb-4 text-lg font-bold text-start">Blog Name</h1>
                        <input
                            value={heading}
                            onChange={(e) => setHeading(e.target.value)}
                            className="w-[20rem] mb-4 h-16 rounded px-2 border-2 bg-[#F0F0F0] border-gray-400"
                            type="text"
                            placeholder="Type heading here ....."
                        />
                    </div>
                    <div className='flex flex-col items-start'>
                        <div className='flex flex-col'>
                            <div className='flex flex-row items-center justify-between mb-2'>
                                <h1 className="text-lg font-medium text-start">Upload Service Photo</h1>
                                <div className="text-sm text-gray-400">
                                    <p>JPG, PNG, Max 4MB</p>
                                </div>
                            </div>
                            <div
                                className="flex items-center justify-center w-[30rem] h-40 p-4 mb-6 bg-[#F5F5F5] border-2 border-[#2E2E2E0D] rounded-md cursor-pointer"
                                onDoubleClick={handleImageUploadClick}
                            >
                                {image ? (
                                    <img src={image} alt="Uploaded" className="object-cover w-full h-full mr-4" />
                                ) : (
                                    <>
                                        <LuImagePlus className="w-12 h-12 mr-4 text-gray-400" />
                                    </>
                                )}
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    style={{ display: 'none' }}
                                    onChange={handleImageUpload}
                                    accept="image/*"
                                />
                            </div>
                        </div>
                        <div className='flex flex-col'>
                            <div className='flex flex-row items-center justify-between mb-2'>
                                <h1 className="text-lg font-medium whitespace-normal text-start text-ellipsis">Service Description</h1>
                                <div className="text-sm text-gray-400">
                                    {`${maxDescriptionLength - description.length}/${maxDescriptionLength} remaining`}
                                </div>
                            </div>
                            <textarea
                                className="w-[40rem] 2xl:h-32 3xl:h-40 px-4 py-2 mb-4 border border-[#E1E1E1] rounded"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                maxLength={maxDescriptionLength}
                                placeholder="Type something longer here....."
                            ></textarea>
                        </div>
                    </div>
                </div>
                <div className="flex justify-center mt-8 space-x-8">
                    <button
                        className="px-6 py-2 font-medium text-black border-2 border-gray-300 rounded-md"
                        onClick={initialData ? handleDelete : onClose}
                    >
                        {initialData ? 'Delete' : 'Cancel'}
                    </button>
                    <button
                        className="px-6 py-2 font-medium text-white bg-black rounded-md"
                        onClick={handleSubmit}
                    >
                        {initialData ? 'Update' : 'Create'}
                    </button>
                </div>
            </div>
        </div>
    );
};

Blogpopup.propTypes = {
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    initialData: PropTypes.shape({
        BlogName: PropTypes.string,
        servDescription: PropTypes.string,
        photo1: PropTypes.string,
        Active: PropTypes.bool,
    }),
    onDelete: PropTypes.func,
};

export default Blogpopup;
