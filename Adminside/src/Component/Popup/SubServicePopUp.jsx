import { useRef, useState, useEffect } from "react";
import { LuImagePlus } from "react-icons/lu";
import { RxCross2 } from 'react-icons/rx';
import PropTypes from 'prop-types';
import axios from "axios";
import { API_BASE_URL } from "../../config";
import { toast } from "react-toastify";

const SubServicePopup = ({ onClose, onSave, initialData, onDelete }) => {
    const [subServiceName, setSubServiceName] = useState("");
    const [subServiceDes, setSubServiceDes] = useState('');
    const [photo1, setPhoto1] = useState(null);
    const [photo2, setPhoto2] = useState(null);
    const [photo3, setPhoto3] = useState(null);  // Single image
    const [photo4, setPhoto4] = useState([]);
    const [featureDes, setFeatureDes] = useState("");
    const [addFeatures, setAddFeatures] = useState(['']);
    const maxDescriptionLength = 300;
    const featuresDesLength = 150;
    const fileInputRef1 = useRef(null);
    const fileInputRef2 = useRef(null);
    const fileInputRef3 = useRef(null);  // Single ref for single image
    const fileInputRefs4 = useRef([]);

    useEffect(() => {
        if (initialData) {
            setSubServiceName(initialData.SubServiceName || '');
            setSubServiceDes(initialData.SubServiceDes || '');
            setPhoto1(initialData.Photo1 || null);
            setPhoto2(initialData.Photo2 || null);
            setPhoto3(initialData.Photo3 || null);  // Single image
            setPhoto4(initialData.Photo4 || []);
            setFeatureDes(initialData.FeatureDes || '');
            setAddFeatures(initialData.AddFeatures || ['']);
        }
    }, [initialData]);

    const handleFeatureChange = (index, event) => {
        const newFeatures = [...addFeatures];
        newFeatures[index] = event.target.value;
        setAddFeatures(newFeatures);
    };

    const addFeature = () => {
        setAddFeatures([...addFeatures, '']);
    };

    const handleImageUpload = async (file, setImageCallback) => {
        if (!file) {
            console.error("No file selected.");
            return;
        }

        const formData = new FormData();
        formData.append("image", file);

        try {
            const response = await axios.post(`${API_BASE_URL}/V1/subserviceimg`, formData);
            const newImageUrl = response.data.imageUrl;
            if (newImageUrl) {
                toast.success("Image uploaded successfully");
                setImageCallback(newImageUrl); // Update the state with the URL from AWS
            } else {
                console.error("Failed to upload image. No URL returned from the server.");
            }
        } catch (error) {
            console.error("Error uploading image: ", error);
            toast.error("Failed to upload image");
        }
    };

    const handleImageChange1 = (e) => handleImageUpload(e.target.files[0], setPhoto1);
    const handleImageChange2 = (e) => handleImageUpload(e.target.files[0], setPhoto2);
    const handleImageChange3 = (e) => handleImageUpload(e.target.files[0], setPhoto3);

    const handleImageUploadClick = (ref) => {
        if (ref && ref.current) {
            ref.current.click();
        }
    };

    const handleImageChange4 = (index, event) => {
        const file = event.target.files[0];
        if (file) {
            handleImageUpload(file, (url) => {
                const newImages = [...photo4];
                newImages[index] = url;
                setPhoto4(newImages);
            });
        }
    };

    const addImageBox4 = () => {
        setPhoto4([...photo4, '']);
    };

    const removeImageBox4 = (index) => {
        const newImages = [...photo4];
        newImages.splice(index, 1);
        setPhoto4(newImages);
    };

    const handleImageUploadClick4 = (index) => {
        if (fileInputRefs4.current[index]) {
            fileInputRefs4.current[index].click();
        }
    };

    const handleDelete = () => {
        onDelete(initialData);
    };

    const handleSubmit = () => {
        const data = {
            SubServiceName: subServiceName,
            SubServiceDes: subServiceDes,
            Photo1: photo1,
            Photo2: photo2,
            Photo3: photo3,  // Single image
            Photo4: photo4,
            FeatureDes: featureDes,
            AddFeatures: addFeatures,
        };
        onSave(data);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-end overflow-auto bg-black bg-opacity-50 backdrop-blur">
            <div className="h-full p-10 overflow-y-auto bg-white rounded-lg shadow-lg 2xl:w-3/5 3xl:3/5 lg:3/4">
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-2xl font-bold">{initialData ? 'Edit Sub Service' : 'New Sub Service'}</h1>
                    <RxCross2 className="cursor-pointer" size={32} onClick={onClose} />
                </div>
                <div className="flex flex-col ml-[1rem] mt-8">
                    <h1 className="text-2xl font-bold text-black">ERP Solutions</h1>
                    <div className="flex flex-row justify-between">
                        <div className='flex flex-row'>
                            <div
                                className="flex items-center justify-center w-[10rem] p-4 mb-6 bg-[#F5F5F5] rounded-md cursor-pointer"
                                onDoubleClick={() => handleImageUploadClick(fileInputRef1)}
                            >
                                {photo1 ? (
                                    <img src={photo1} alt="Uploaded" className="object-cover w-full h-full mr-4" />
                                ) : (
                                    <>
                                        <LuImagePlus className="w-12 h-12 mr-4 text-gray-400" />
                                    </>
                                )}
                                <input
                                    type="file"
                                    ref={fileInputRef1}
                                    style={{ display: 'none' }}
                                    onChange={handleImageChange1}
                                    accept="image/*"
                                />
                            </div>
                            <div>
                                <p className="mt-8 ml-4 text-sm text-gray-500">JPG, PNG, Max 4MB</p>
                            </div>
                        </div>
                    </div>
                    <label className="text-lg font-normal text-start"> Sub Service Name</label>
                    <input
                        className="w-[20rem] mb-4 h-10 bg-[#F5F5F5] border-2 border-[#2E2E2E0D] rounded px-2"
                        type="text"
                        value={subServiceName}
                        onChange={(e) => setSubServiceName(e.target.value)}
                    />
                    <div className='flex flex-row items-center mb-2 space-x-20'>
                        <h1 className="text-lg font-medium text-start">Upload Cover photo</h1>
                        <div className="text-sm text-gray-400">
                            <p>JPG, PNG, Max 4MB</p>
                        </div>
                    </div>
                    <div
                        className="flex items-center justify-center 3xl:w-[30rem] 2xl:w-[24rem] xl:w-[24rem] lg:w-[24rem] h-[10rem] p-4 mb-6 bg-[#F5F5F5] border-2 border-[#2E2E2E0D] rounded-md cursor-pointer"
                        onDoubleClick={() => handleImageUploadClick(fileInputRef2)}
                    >
                        {photo2 ? (
                            <img src={photo2} alt="Uploaded" className="object-cover w-full h-full mr-4" />
                        ) : (
                            <>
                                <LuImagePlus className="w-12 h-12 mr-4 text-gray-400" />
                            </>
                        )}
                        <input
                            type="file"
                            ref={fileInputRef2}
                            style={{ display: 'none' }}
                            onChange={handleImageChange2}
                            accept="image/*"
                        />
                    </div>
                    <div className='flex flex-row items-start space-x-6'>
                        <div className='flex flex-col'>
                            <div className='flex flex-row items-center justify-between mb-2'>
                                <h1 className="text-lg font-medium whitespace-normal text-start text-ellipsis">Service Description</h1>
                                <div className="text-sm text-gray-400">
                                    {`${maxDescriptionLength - subServiceDes.length}/${maxDescriptionLength} remaining`}
                                </div>
                            </div>
                            <textarea
                                className="3xl:w-[30rem] 2xl:w-[24rem] xl:w-[24rem] lg:w-[24rem] h-[10rem] px-4 py-2 mb-4 border border-[#E1E1E1] rounded"
                                value={subServiceDes}
                                onChange={(e) => setSubServiceDes(e.target.value)}
                                maxLength={maxDescriptionLength}
                                placeholder="Type something longer here....."
                            ></textarea>
                        </div>
                        <div className='flex flex-col'>
                            <div className='flex flex-row items-center justify-between mb-2'>
                                <h1 className="text-lg font-medium text-start">Upload Service Photo</h1>
                                <div className="text-sm text-gray-400">
                                    <p>JPG, PNG, Max 4MB</p>
                                </div>
                            </div>
                            <div
                                className="flex items-center justify-center 3xl:w-[30rem] 2xl:w-[24rem] xl:w-[24rem] lg:w-[24rem] h-[10rem] p-4 mb-6 bg-[#F5F5F5] border-2 border-[#2E2E2E0D] rounded-md cursor-pointer"
                                onDoubleClick={() => handleImageUploadClick(fileInputRef3)}
                            >
                                {photo3 ? (
                                    <img src={photo3} alt="Uploaded" className="object-cover w-full h-full mr-4" />
                                ) : (
                                    <>
                                        <LuImagePlus className="w-12 h-12 mr-4 text-gray-400" />
                                    </>
                                )}
                                <input
                                    type="file"
                                    ref={fileInputRef3}
                                    style={{ display: 'none' }}
                                    onChange={handleImageChange3}
                                    accept="image/*"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-row rounded-lg w-[30rem] space-x-8 h-auto">
                        <div className='flex flex-col'>
                            <div className='flex flex-row items-center justify-between mb-2'>
                                <h1 className="text-lg font-medium whitespace-normal text-start text-ellipsis">Features Description</h1>
                                <div className="text-sm text-gray-400">
                                    {`${featuresDesLength - featureDes.length}/${featuresDesLength} remaining`}
                                </div>
                            </div>
                            <textarea
                                className="3xl:w-[30rem] 2xl:w-[24rem] xl:w-[24rem] lg:w-[24rem] h-[10rem] px-4 py-2 mb-4 border border-[#E1E1E1] rounded"
                                value={featureDes}
                                onChange={(e) => setFeatureDes(e.target.value)}
                                maxLength={featuresDesLength}
                                placeholder="Type something longer here....."
                            ></textarea>
                        </div>
                        <div className="flex flex-col mb-4">
                            <h1 className="mb-2 text-lg font-normal text-start">Add Features</h1>
                            <div className="flex flex-col space-y-2 3xl:w-[30rem] 2xl:w-[24rem] xl:w-[24rem] lg:w-[24rem] h-[10rem] overflow-y-auto border border-[#E1E1E1] rounded p-2">
                                {addFeatures.map((feature, index) => (
                                    <input
                                        key={index}
                                        type="text"
                                        placeholder="Type features here...."
                                        value={feature}
                                        onChange={(event) => handleFeatureChange(index, event)}
                                        className="border border-1 border-[#0000003B] px-2 py-2 w-full rounded"
                                    />
                                ))}
                                <button
                                    className="border border-1 border-[#0000003B] bg-black text-white px-2 py-2 w-full rounded"
                                    onClick={addFeature}
                                >
                                    + Add new feature
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className='flex flex-row items-center mb-2 space-x-32'>
                        <h1 className="text-lg font-medium text-start">Upload Images</h1>
                        <div className="text-sm text-gray-400">
                            <p>JPG, PNG, Max 4MB</p>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-4 p-4 border border-gray-400 border-dashed">
                        {photo4.map((imageSrc, index) => (
                            <div key={index} className="relative">
                                <div
                                    onDoubleClick={() => handleImageUploadClick4(index)}
                                    className="flex flex-col justify-center p-2 text-center border-2 border-gray-300 border-dashed rounded cursor-pointer w-36 h-36"
                                    style={{ background: "rgba(194, 194, 194, 0.56)" }}
                                >
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        ref={(el) => (fileInputRefs4.current[index] = el)}
                                        onChange={(event) => handleImageChange4(index, event)}
                                    />
                                    {imageSrc ? (
                                        <img
                                            src={imageSrc}
                                            alt={`uploaded-${index}`}
                                            className="object-cover w-full h-full rounded"
                                        />
                                    ) : (
                                        <LuImagePlus className="flex self-center mx-auto text-gray-500 cursor-pointer" />
                                    )}
                                </div>
                                {imageSrc && (
                                    <button
                                        className="absolute top-0 right-0 text-red-500 cursor-pointer"
                                        onClick={() => removeImageBox4(index)}
                                    >
                                        &times;
                                    </button>
                                )}
                            </div>
                        ))}

                        <div
                            className="flex p-2 text-center border-2 border-gray-300 border-dashed rounded cursor-pointer w-36 h-36"
                            onClick={addImageBox4}
                        >
                            <LuImagePlus className="flex self-center mx-auto text-gray-500" />
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

SubServicePopup.propTypes = {
    onClose: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
    initialData: PropTypes.shape({
        SubServiceName: PropTypes.string,
        SubServiceDes: PropTypes.string,
        Photo1: PropTypes.string,
        Photo2: PropTypes.string,
        Photo3: PropTypes.string,
        Photo4: PropTypes.arrayOf(PropTypes.string),
        FeatureDes: PropTypes.string,
        AddFeatures: PropTypes.arrayOf(PropTypes.string),
    }),
    onDelete: PropTypes.func,
};

export default SubServicePopup;
