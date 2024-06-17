import { useState, useRef } from 'react';
import { LuImagePlus } from 'react-icons/lu'; // Assuming you have this icon in your library
import PropTypes from 'prop-types';
import { RxCross2 } from 'react-icons/rx';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from 'axios'; // Make sure to import axios
import { API_BASE_URL } from "../../config"; // Ensure you have the correct API base URL

const Popup = ({ onClose, onSubmit, initialData, onDelete }) => {
    const [serviceName, setServiceName] = useState(initialData?.ServiceName || '');
    const [description, setDescription] = useState(initialData?.Description || '');
    const [image, setImage] = useState(initialData?.Photos || null);
    const maxDescriptionLength = 300;
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
            const response = await axios.post(`${API_BASE_URL}/V1/uploadImg`, formData);
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
            ServiceName: serviceName,
            Description: description,
            Photos: image,
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur">
            <div className="bg-white p-8 rounded-lg shadow-lg w-[36rem] h-auto">
                <div className='flex flex-row items-center justify-between'>
                    <h1 className="mb-6 text-xl font-bold text-start">{initialData ? 'Edit Service' : 'New Service'}</h1>
                    <RxCross2 className='cursor-pointer' size={24} onClick={onClose} />
                </div>
                <div className='bg-[#F5F5F5] p-6 rounded-lg mb-6'>
                    <div className='flex flex-row'>
                        <div
                            className="flex items-center justify-center w-[10rem] p-4 mb-6 bg-white rounded-md cursor-pointer"
                            onDoubleClick={handleImageUploadClick}
                        >
                            {image ? (
                                <img src={image} alt="Uploaded" className="w-12 h-12 mr-4" />
                            ) : (
                                <LuImagePlus className="w-12 h-12 mr-4 text-gray-400" />
                            )}
                            <input
                                type="file"
                                ref={fileInputRef}
                                style={{ display: 'none' }}
                                onChange={handleImageUpload}
                                accept="image/*"
                            />
                        </div>
                        <div>
                            <p className="mt-8 ml-4 text-sm text-gray-500">JPG, PNG, Max 4MB</p>
                        </div>
                    </div>

                    <h1 className="mb-2 text-lg font-medium whitespace-normal text-start text-ellipsis">Sub-Service Name</h1>
                    <input
                        className="w-[16rem] h-10 px-4 mb-4 border border-[#E1E1E1] rounded"
                        type="text"
                        value={serviceName}
                        onChange={(e) => setServiceName(e.target.value)}
                        placeholder="Add Name"
                        required
                    />

                    <div className='flex flex-row items-center justify-between mb-2'>
                        <h1 className="text-lg font-medium whitespace-normal text-start text-ellipsis">Add Description</h1>
                        <div className="text-sm text-gray-400">
                            {`${maxDescriptionLength - description.length}/${maxDescriptionLength} remaining`}
                        </div>
                    </div>
                    <textarea
                        className="w-full h-32 px-4 py-2 mb-4 border border-[#E1E1E1] rounded"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        maxLength={maxDescriptionLength}
                        placeholder="Type something longer here....."
                        required
                    ></textarea>
                </div>
                <div className="flex justify-center space-x-8">
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

Popup.propTypes = {
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    initialData: PropTypes.shape({
        ServiceName: PropTypes.string,
        Description: PropTypes.string,
        Photos: PropTypes.string,
        Active: PropTypes.bool,
    }),
    onDelete: PropTypes.func.isRequired,
};

export default Popup;
