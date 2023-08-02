import React from 'react'
import { Link } from 'react-router-dom';
import me from '../assets/1.jpg'
import jawad from '../assets/jawad.jpg'
import maam from '../assets/maam.jpg'

export default function AboutUS() {
    return (
        <section className="text-gray-600 body-font">
            <div className="container px-5 py-24 mx-auto">
                {/* <div className="flex flex-col text-center w-full mb-20">
                    <h1 className="text-2xl font-medium title-font mb-4 text-gray-900">
                        OUR TEAM
                    </h1>
                    <p className="lg:w-2/3 mx-auto leading-relaxed text-base">
                    </p>
                </div> */}

                <div className="flex flex-wrap  items-center justify-center">

                    <div className="flex flex-col items-center justify-center">
                        <div className="w-96 rounded-3xl shadow border m-5 flex flex-col items-center" style={{ backgroundColor: '#2F2F2F', height: '450px' }}>
                            <img
                                src={maam}
                                alt="Profile"
                                className="h-32 w-32 rounded-full object-cover mt-5"
                            />
                            <div className="md:space-y-2 sm:p-8 flex flex-col items-center justify-center">
                                <h1 className="text-xl leading-tight tracking-tight md:text-2xl" style={{ color: '#C39601' }}>
                                    Ms. Iqra Javed
                                </h1>
                                <small style={{ color: '#F6F6F6' }}>Project Supervisor</small>
                                <p style={{ color: '#F6F6F6' }} className='text-center'>Help others and give something back. I guarantee you will discover that while public service improves the lives and the world around you, its greatest reward is the enrichment and new meaning it will bring your own life.</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col items-center justify-center">
                        <div className="w-96 rounded-3xl shadow border m-5 flex flex-col items-center" style={{ backgroundColor: '#2F2F2F', height: '450px' }}>
                            <img
                                src={me}
                                alt="Profile"
                                className="h-32 w-32 rounded-full object-cover mt-5"
                            />
                            <div className="md:space-y-2 sm:p-8 flex flex-col items-center justify-center">
                                <h1 className="text-xl leading-tight tracking-tight md:text-2xl" style={{ color: '#C39601' }}>
                                    Saad Bin Amir
                                </h1>
                                <small style={{ color: '#F6F6F6' }}>Team lead</small>
                                <p style={{ color: '#F6F6F6' }} className='text-center'>Without community service, we would not have a strong quality of life. it's important to the person who serves as well as the recipient. It's the way in which we ourselves grow and develop.</p>

                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col items-center justify-center">
                        <div className="w-96 rounded-3xl shadow border m-5 flex flex-col items-center " style={{ backgroundColor: '#2F2F2F', height: '450px' }}>
                            <img
                                src={jawad}
                                alt="Profile"
                                className="h-32 w-32 rounded-full object-cover mt-5"
                            />
                            <div className="md:space-y-2 sm:p-8 flex flex-col items-center justify-center">
                                <h1 className="text-xl leading-tight tracking-tight md:text-2xl" style={{ color: '#C39601' }}>
                                    Jawad Farooque
                                </h1>
                                <small style={{ color: '#F6F6F6' }}>Nikamma partner</small>
                                <p style={{ color: '#F6F6F6' }} className='text-center'>The best way to find yourself is to lose yourself in the service of others.</p>
                            </div>
                        </div>
                    </div>



                </div>
            </div>
        </section>







    )
}


