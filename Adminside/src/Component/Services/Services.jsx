import { useState, useEffect } from 'react';
import axios from 'axios';
import Popup from '../Popup/Popup';
import { BiSolidEditAlt, BiShow, BiHide } from 'react-icons/bi';
import { CiSearch } from "react-icons/ci";
import { useNavigate } from "react-router";
import { API_BASE_URL } from "../../config";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Services = () => {
    const navigate = useNavigate();
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [editingIndex, setEditingIndex] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [services, setServices] = useState([]);

    // Fetch services on load
    useEffect(() => {
        const fetchServices = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/v1/getPrimary`);
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

    const handleClosePopup = () => {
        setIsPopupOpen(false);
        setEditingIndex(null);
    };

    const handlePopupToggle = (index = null) => {
        setIsPopupOpen(true);
        setEditingIndex(index);
    };

    const handleFormSubmit = async (data) => {
        try {
            let response;
            if (editingIndex !== null) {
                response = await axios.put(`${API_BASE_URL}/v1/updatePrimary/${services[editingIndex].id}`, data);
            } else {
                response = await axios.post(`${API_BASE_URL}/v1/Service`, data);
            }

            if (response.status === 200 || response.status === 201) {
                toast.success(editingIndex !== null ? 'Service updated successfully' : 'Service added successfully');
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
            await axios.delete(`${API_BASE_URL}/v1/deletbyId/${serviceToDelete.id}`);
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
            const response = await axios.put(`${API_BASE_URL}/v1/updatePrimary/${services[index].id}`, updatedService);
            setServices(services.map((service, idx) => idx === index ? response.data.data : service));
        } catch (error) {
            console.error("Error toggling published state:", error);
            toast.error("An error occurred while toggling the published state");
        }
    };

    const filteredServices = Array.isArray(services) ? services.filter(service =>
        service.ServiceName.toLowerCase().includes(searchQuery.toLowerCase())
    ) : [];


    return (
        <>
            <ToastContainer position="top-center" />
            <div className=" top-0 left-0 right-0 z-50 bg-white  ml-[12.5rem] pt-2">
                <div className="flex items-center justify-between h-16 px-10">
                    <h1 className="text-2xl font-bold text-gray-800">
                        Services
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
                        + Add New Service
                    </button>
                </div>

                {isPopupOpen && (
                    <Popup
                        onClose={handleClosePopup}
                        onSubmit={handleFormSubmit}
                        initialData={editingIndex !== null ? services[editingIndex] : null}
                        onDelete={handleDelete}
                    />
                )}
                <div className='w-4/5 p-6 bg-white rounded-lg shadow-lg ml-[16rem]'>
                    <div className="grid grid-cols-1 gap-3 px-2 pt-[2rem] pb-[10rem] rounded-lg md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-7">
                        {filteredServices.map((service, index) => (
                            <div
                                key={index}
                                className="flex flex-col items-center p-4 w-[12rem] transition-shadow duration-300 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-lg relative"
                                onClick={() => navigate("Subservice")}
                            >
                                <div className='absolute flex flex-row items-center top-2 left-2'>
                                    <div
                                        className={`w-2 h-2 rounded-full ${service.Active ? 'bg-green-500' : 'bg-gray-400'}`}
                                    ></div>
                                </div>
                                <div className="flex items-center justify-center w-[6rem] h-20 mb-4 mt-4 bg-[#F5F5F5] border-2 border-[#2E2E2E0D] rounded-md">
                                    {service.Photos && <img src={service.Photos} alt={service.ServiceName} className="object-cover w-full h-full rounded-md" />}
                                </div>
                                <span className="text-lg font-semibold whitespace-nowrap">{service.ServiceName}</span>
                                <div className="flex items-center mt-4 space-x-2">
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

export default Services;
