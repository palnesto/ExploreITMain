import { useEffect, useState } from "react";
import { CiSearch } from "react-icons/ci";
import axios from 'axios';
import { BiSolidEditAlt, BiShow, BiHide } from "react-icons/bi";
import SubServicePopup from "../Popup/SubServicePopUp";
import { API_BASE_URL } from "../../config";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Subservice = () => {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [services, setServices] = useState([]);
    const [editingIndex, setEditingIndex] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/v1/getsubService`);
                if (response.data && response.data.status) {
                    setServices(response.data.data);
                } else {
                    console.error("API response does not contain expected data");
                }
            } catch (error) {
                console.log("Error fetching services: ", error);
            }
        };
        fetchServices();
    }, []);

    const handlePopupToggle = (index = null) => {
        setEditingIndex(index);
        setIsPopupOpen(true);
    };

    const handleClosePopup = () => {
        setIsPopupOpen(false);
        setEditingIndex(null);
    };

    const handleFormSubmit = async (data) => {
        try {
            let response;
            if (editingIndex !== null) {
                response = await axios.put(`${API_BASE_URL}/v1/updatesubService/${services[editingIndex].id}`, data);
            } else {
                response = await axios.post(`${API_BASE_URL}/v1/subService`, data);
            }

            if (response.status === 200 || response.status === 201) {
                toast.success(editingIndex !== null ? 'Sub-service updated successfully' : 'Sub-service added successfully');
                setServices(editingIndex !== null ? services.map((service, index) => index === editingIndex ? response.data.data : service) : [response.data.data, ...services]);
                handleClosePopup();
            } else {
                toast.error("Something went wrong");
            }
        } catch (error) {
            console.error("Error submitting form:", error);
            toast.error("An error occurred while submitting the form");
        }
    };

    const handleDelete = async (serviceToDelete) => {
        try {
            await axios.delete(`${API_BASE_URL}/v1/deletsubServicebyId/${serviceToDelete.id}`);
            setServices(services.filter(service => service.id !== serviceToDelete.id));
            handleClosePopup();
        } catch (error) {
            console.error("Error deleting service:", error);
            toast.error("An error occurred while deleting the service");
        }
    };

    const togglePublished = async (e, index) => {
        e.stopPropagation();
        try {
            const updatedService = { ...services[index], Active: !services[index].Active };
            const response = await axios.put(`${API_BASE_URL}/v1/updatesubService/${services[index].id}`, updatedService);
            setServices(services.map((service, idx) => idx === index ? response.data.data : service));
        } catch (error) {
            console.error("Error toggling published state:", error);
            toast.error("An error occurred while toggling the published state");
        }
    };

    const filteredServices = Array.isArray(services) ? services.filter(service =>
        service.SubServiceName.toLowerCase().includes(searchQuery.toLowerCase())
    ) : [];

    return (
        <>
            <ToastContainer position="top-center" />
            <div className="top-0 left-0 right-0 z-50 bg-white ml-[12.5rem] pt-2">
                <div className="flex items-center justify-between h-16 px-10">
                    <h1 className="text-2xl font-bold text-gray-800">
                        ERP Solutions / <span className="font-normal">Sub Services</span>
                    </h1>
                    <div className="relative flex items-center">
                        <input
                            type="text"
                            placeholder="Search for something"
                            className="px-4 py-2 text-sm bg-gray-100 text-[#2E2E2E] rounded-full focus:outline-none"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <CiSearch className="absolute text-xl text-gray-600 right-3" />
                    </div>
                </div>
            </div>
            <div className="bg-[#F1F1F1] py-10 mt-8">
                <div className="flex justify-start ml-[16rem] mb-6">
                    <button
                        className="px-4 py-3 font-medium text-black bg-white shadow-md rounded-xl"
                        onClick={() => handlePopupToggle()}
                    >
                        + Add New Sub Service
                    </button>
                </div>

                {isPopupOpen && (
                    <SubServicePopup
                        onSave={handleFormSubmit}
                        onClose={handleClosePopup}
                        initialData={editingIndex !== null ? services[editingIndex] : null}
                        onDelete={handleDelete}
                    />
                )}

                <div className='w-4/5 p-6 bg-white rounded-lg shadow-lg ml-[16rem]'>
                    <div className="grid grid-cols-1 gap-3 px-2 pt-[2rem] pb-[10rem] rounded-lg md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-4">
                        {filteredServices.map((service, index) => (
                            <div onClick={() => handlePopupToggle(index)}
                                key={index} className="flex items-center py-12 h-auto px-4 bg-white border rounded-lg shadow relative w-[22rem]">
                                <div
                                    className={`w-2 h-2 rounded-full absolute top-2 right-2 ${service.Active ? 'bg-green-500' : 'bg-gray-400'}`}
                                ></div>
                                <div className="flex items-center space-x-4">
                                    <div className="flex items-start justify-start w-[5rem] h-20 mb-4 mt-[-2rem] bg-[#F5F5F5] border-2 border-[#2E2E2E0D] rounded-md">
                                        {service.Photo1 && <img src={service.Photo1} alt={service.SubServiceName} className="object-cover w-full h-full rounded-md" />}
                                    </div>
                                    <div className="flex flex-col w-[14rem]">
                                        <h1 className="text-lg font-bold text-black mt-[-3rem] whitespace-normal overflow-hidden text-ellipsis">{service.SubServiceName}</h1>
                                        <p className="overflow-hidden text-sm text-black whitespace-normal text-ellipsis">{service.SubServiceDes}</p>
                                    </div>
                                </div>
                                <div className="absolute flex items-center space-x-2 bottom-2 right-6">
                                    <button onClick={(e) => { e.stopPropagation(); togglePublished(e, index); }}>
                                        {service.Active ? <BiShow className="p-1 text-gray-600 border border-gray-300 rounded-md" size={24} /> : <BiHide className="p-1 text-gray-400 border border-gray-300 rounded-md" size={24} />}
                                    </button>
                                    <BiSolidEditAlt className="p-1 border border-gray-300 rounded-md cursor-pointer" onClick={(e) => { e.stopPropagation(); handlePopupToggle(index); }} size={24} />
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            </div>
        </>
    );
};

export default Subservice;
