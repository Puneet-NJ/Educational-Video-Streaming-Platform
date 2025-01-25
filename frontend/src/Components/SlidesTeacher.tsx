import useSlidesTeacher from "@/Hooks/useSlidesTeacher";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useRecoilValue } from "recoil";
import { currSlideAtom, slidesLinksAtom } from "@/lib/atom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useMemo } from "react";

export const SlidesTeacher = ({
	handleChangeScene,
}: {
	handleChangeScene: (
		activeScene: "slides" | "board" | "default" | "screen"
	) => void;
}) => {
	const { handleSlidesChange, handleUploadSlides, slideImageChange } =
		useSlidesTeacher(handleChangeScene);

	const currSlideIndex = useRecoilValue(currSlideAtom);
	const slidesLinks = useRecoilValue(slidesLinksAtom);

	const isLastSlide = useMemo(
		() => (currSlideIndex === slidesLinks.length - 1 ? true : false),
		[currSlideIndex, slidesLinks]
	);

	const isFirstSlide = useMemo(
		() => (currSlideIndex === 0 ? true : false),
		[currSlideIndex]
	);

	console.log(slidesLinks);

	return (
		<div className="w-full h-full flex justify-center items-center">
			<div className="flex flex-col justify-center items-center w-full h-full">
				{slidesLinks.length > 0 ? (
					<div className="flex items-center w-full relative">
						<div className="relative w-full h-full p-1 border bg-purple-400 border-gray-300 flex justify-center items-center">
							<img
								className="w-full h-full object-contain"
								src={
									import.meta.env.VITE_CLOUDFRONT_URL +
									slidesLinks[currSlideIndex!]
								}
								alt="Slide"
							/>
							<Button
								className={
									"absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/50 hover:bg-white/75" +
									(isFirstSlide ? " cursor-not-allowed" : null)
								}
								onClick={() => slideImageChange("prev")}
							>
								<ArrowLeft />
							</Button>
							<Button
								className={
									"absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/50 hover:bg-white/75" +
									(isLastSlide ? " cursor-not-allowed" : null)
								}
								onClick={() => slideImageChange("next")}
							>
								<ArrowRight />
							</Button>
						</div>
					</div>
				) : (
					<>
						<div className="grid w-full max-w-sm items-center gap-1.5">
							<Input
								type="file"
								onChange={handleSlidesChange}
								accept="application/pdf"
							/>
						</div>
						<Button className="my-10" onClick={handleUploadSlides}>
							Upload slides
						</Button>
					</>
				)}
			</div>
		</div>
	);
};
