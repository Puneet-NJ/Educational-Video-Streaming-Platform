import { useMemo } from "react";
import { useRecoilValue } from "recoil";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import useSlidesTeacher from "@/Hooks/useSlidesTeacher";
import { currSlideAtom, slidesLinksAtom } from "@/lib/atom";

export const SlidesTeacher = () => {
	const { handleSlidesChange, handleUploadSlides, slideImageChange } =
		useSlidesTeacher();
	const currSlideIndex = useRecoilValue(currSlideAtom);
	const slidesLinks = useRecoilValue(slidesLinksAtom);

	const isLastSlide = useMemo(
		() => currSlideIndex === slidesLinks.length - 1,
		[currSlideIndex, slidesLinks]
	);

	const isFirstSlide = useMemo(() => currSlideIndex === 0, [currSlideIndex]);

	return (
		<div className="w-full h-full flex justify-center items-center">
			<div className="flex flex-col justify-center items-center w-full h-full max-h-screen">
				{slidesLinks.length > 0 ? (
					<div className="relative w-full h-full flex justify-center items-center bg-gray-500">
						<div className="relative w-full h-full flex justify-center items-center border border-gray-300 rounded-lg overflow-hidden">
							<div className="relative w-full h-full flex justify-center items-center">
								<img
									className="w-auto h-full max-w-full max-h-full object-contain"
									src={
										import.meta.env.VITE_CLOUDFRONT_URL +
										slidesLinks[currSlideIndex!]
									}
									alt="Slide"
								/>
							</div>

							<Button
								className={`absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/50 hover:bg-white/75 ${
									isFirstSlide ? "opacity-50 cursor-not-allowed" : ""
								}`}
								onClick={() => slideImageChange("prev")}
								disabled={isFirstSlide}
							>
								<ArrowLeft />
							</Button>

							<Button
								className={`absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/50 hover:bg-white/75 ${
									isLastSlide ? "opacity-50 cursor-not-allowed" : ""
								}`}
								onClick={() => slideImageChange("next")}
								disabled={isLastSlide}
							>
								<ArrowRight />
							</Button>
						</div>
					</div>
				) : (
					<div className="w-full max-w-sm space-y-4">
						<Input
							type="file"
							onChange={handleSlidesChange}
							accept="application/pdf"
						/>
						<Button className="w-full" onClick={handleUploadSlides}>
							Upload slides
						</Button>
					</div>
				)}
			</div>
		</div>
	);
};

export default SlidesTeacher;
