import { Ref } from "react";

export const VideoComp = ({
	videoRef,
	teacher,
	className,
}: {
	videoRef: Ref<HTMLVideoElement>;
	teacher?: string;
	className?: string;
}) => {
	return (
		<div
			className={
				"bg-yellow-500 relative w-full h-full flex items-center justify-center" +
				(className ? ` ${className}` : "")
			}
		>
			<div className="w-full h-full flex items-center justify-center overflow-hidden bg-gray-400">
				<video
					ref={videoRef}
					className="min-w-full max-w-full min-h-full max-h-full object-contain"
					autoPlay
					muted
					playsInline
				/>
			</div>
			{teacher && (
				<div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded">
					{teacher}
				</div>
			)}
		</div>
	);
};
