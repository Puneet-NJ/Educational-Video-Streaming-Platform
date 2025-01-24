import useSlidesTeacher from "@/Hooks/useSlidesTeacher";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useRecoilValue } from "recoil";
import { slidesLinksAtom } from "@/lib/atom";
import { ArrowLeft, ArrowRight } from "lucide-react";
export const SlidesTeacher = () => {
	const {
		handleSlidesChange,
		handleUploadSlides,
		currSlideIndex,
		slideImageChange,
	} = useSlidesTeacher();
	const slidesLinks = useRecoilValue(slidesLinksAtom);

	console.log(slidesLinks);

	return (
		<div className="max-w-full max-h-full bg-red-400 flex justify-center items-center">
			<div className="flex flex-col justify-center items-center w-full max-w-3xl">
				{slidesLinks.length > 0 ? (
					<>
						<div className="flex items-center w-full">
							<Button
								className="rounded-full mx-2"
								onClick={() => slideImageChange("prev")}
							>
								<ArrowLeft />
							</Button>
							<div className="relative flex-grow h-[500px] bg-white border border-gray-300">
								<img
									className="w-full h-full object-contain block"
									src={
										import.meta.env.VITE_CLOUDFRONT_URL +
										slidesLinks[currSlideIndex]
									}
									alt="Slide"
								/>
							</div>
							<Button
								className="rounded-full mx-2"
								onClick={() => slideImageChange("next")}
							>
								<ArrowRight />
							</Button>
						</div>
					</>
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
