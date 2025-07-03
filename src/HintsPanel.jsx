import React from 'react';
import './App.css';

const HintsPanel = ({ hints }) => {
    return (
        <div 
        className="w-[600px] p-5 bg-[#FBF5E9] 
                    border-solid border-4 border-[#FFBB88] 
                    rounded-[24px]
                    relative 
                    before:absolute before:inset-0 
                    before:border-4 before:border-[#FFDD80] before:rounded-[20px] 
                    before:pointer-events-none before:-z-10
                    relative
                    after:absolute after:inset-1
                    after:border-4 after:border-[#FFEE60] after:rounded-[16px] 
                    after:pointer-events-none after:-z-10"
        style={{
            boxShadow: '12px 12px 36px rgba(0, 0, 0, 0.5)',
            zIndex: 10
        }}
        >
            <div className="space-y-1">
                {hints.map((hint, index) => (
                <div
                    key={index}
                    className={`group ${
                    index % 2 === 0 ? "bg-[#F9EAD3]" : "bg-[#FBF5E9]"
                    } rounded-lg p-4 flex items-center`}
                >

                <div className="flex items-center gap-6 relative"> 
                    <div className="w-48">
                        <div className="text-[#7B3211] font-extrabold text-sm tracking-wide orbitron-font">
                        {hint}
                        </div>
                    </div>

                    <div className="flex-1">
                        <div className="relative group/input">
                        <input
                            type="text"
                            className="w-full h-6 bg-transparent px-3
                                    orbitron-font text-[#7B3211] font-bold
                                    placeholder:text-[#D1A17C] placeholder:font-semibold
                                    border-b-2 border-[#7B3211] border-opacity-10
                                    focus:border-[#FF6B35] focus:border-opacity-30
                                    focus:outline-none transition-colors"
                            placeholder="Notes..."
                        />

                        <div className="absolute right-0 top-1/2 -translate-y-1/2 
                                        w-1 h-1 rounded-full bg-[#FFDD44] opacity-40
                                        group-focus-within/input:w-2 group-focus-within/input:h-[2px]
                                        transition-all"></div>
                        </div>
                    </div>
                    </div>
                </div>
                ))}
            </div>
        </div>
      );
    };
    
export default HintsPanel;
