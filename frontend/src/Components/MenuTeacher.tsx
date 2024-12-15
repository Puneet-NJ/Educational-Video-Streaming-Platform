import useMenuTeacher from "@/Hooks/useMenuTeacher";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useRecoilValue } from "recoil";
import { slidesLinksAtom } from "@/lib/atom";

export const MenuTeacher = () => {
	const { handleSlidesChange, handleUploadSlides, slideLinks } =
		useMenuTeacher();
	const slidesLinks = useRecoilValue(slidesLinksAtom);

	return (
		<div className="my-20">
			<div className="grid w-full max-w-sm items-center gap-1.5">
				<Input
					type="file"
					onChange={handleSlidesChange}
					onClick={() => {
						console.log("hi");
					}}
					accept="application/pdf"
				/>
			</div>

			<Button className="my-10" onClick={handleUploadSlides}>
				Upload slides
			</Button>

			<ul>
				{slideLinks.map((link) => (
					<li>{JSON.stringify(link)}</li>
				))}
			</ul>

			{slideLinks.map((link) => (
				<img src={process.env.CLOUDFRONT_URL + link} />
			))}
		</div>
	);
};
