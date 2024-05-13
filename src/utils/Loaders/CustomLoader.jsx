import React from "react";

const CustomLoader = () => {
	return (
		<div
			style={{
				position: "absolute",
				top: "50%",
				left: "50%",
				transform: "translate(-50%, -50%)",
				zIndex: 999, // Adjust as needed
			}}
		>
			<div class="spinner"></div>
		</div>
	);
};

export default CustomLoader;
