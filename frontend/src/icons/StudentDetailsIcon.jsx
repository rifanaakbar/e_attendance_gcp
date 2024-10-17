import React from 'react';
import { classNames } from '../utilities';

export const StudentDetailsIcon = ({ fill = '', className, onClick }) => {
  return (
    <svg
      className={classNames('cursor-pointer', className)}
      onClick={onClick}
      fill="none"
      width="15"
      height="17"
      viewBox="0 0 16 17"
      xmlns="http://www.w3.org/2000/svg"
    >
     <path d="M3.18066 9.61099H8.27157V10.8124H3.18066V9.61099ZM3.18066 6.60742H10.817V7.80885H3.18066V6.60742ZM3.18066 12.6146H6.36248V13.816H3.18066V12.6146Z" fill="#666666"/>
     <path d="M12.7273 1.80214H10.8182V1.20143C10.8182 0.88279 10.6841 0.577202 10.4454 0.35189C10.2067 0.126579 9.883 0 9.54545 0H4.45455C4.117 0 3.79327 0.126579 3.55459 0.35189C3.31591 0.577202 3.18182 0.88279 3.18182 1.20143V1.80214H1.27273C0.935179 1.80214 0.611456 1.92872 0.372773 2.15403C0.13409 2.37934 0 2.68493 0 3.00357V15.6186C0 15.9372 0.13409 16.2428 0.372773 16.4681C0.611456 16.6934 0.935179 16.82 1.27273 16.82H12.7273C13.0648 16.82 13.3885 16.6934 13.6272 16.4681C13.8659 16.2428 14 15.9372 14 15.6186V3.00357C14 2.68493 13.8659 2.37934 13.6272 2.15403C13.3885 1.92872 13.0648 1.80214 12.7273 1.80214ZM4.45455 1.20143H9.54545V3.60429H4.45455V1.20143ZM12.7273 15.6186H1.27273V3.00357H3.18182V4.80571H10.8182V3.00357H12.7273V15.6186Z" fill="#666666"/>
    </svg>
  );
};