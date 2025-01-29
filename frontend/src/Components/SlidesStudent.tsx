import useSlidesStudent from "@/Hooks/useSlidesStudent";
import { currSlideAtom, slidesLinksAtom } from "@/lib/atom";
import { useRecoilValue } from "recoil";

export const SlidesStudent = () => {
	useSlidesStudent();

	const currSlideIndex = useRecoilValue(currSlideAtom);
	const slidesLinks = useRecoilValue(slidesLinksAtom);

	if (!slidesLinks)
		return (
			<div className="w-full h-full flex justify-center items-center font-bold">
				Teacher is yet to upload slides
			</div>
		);
	return (
		<div className="w-full h-full bg-gray-500">
			<img
				className="w-full h-full object-contain"
				src={import.meta.env.VITE_CLOUDFRONT_URL + slidesLinks[currSlideIndex!]}
				alt="Slide"
			/>
		</div>
	);
};
