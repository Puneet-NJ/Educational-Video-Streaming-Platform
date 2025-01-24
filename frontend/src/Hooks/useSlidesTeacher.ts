import { BACKEND_URL } from "@/lib/lib";
import axios from "axios";
import { useState } from "react";
import useToken from "./useToken";
import { useMutation } from "@tanstack/react-query";
import { useRecoilValue, useRecoilState } from "recoil";
import { roomIdAtom, slidesLinksAtom } from "@/lib/atom";

const useSlidesTeacher = () => {
	const [slides, setSlides] = useState<File>();
	const [currSlideIndex, setCurrSlideIndex] = useState(0);

	const maxSlidesSize = 5 * 1000000;
	const { getToken } = useToken();
	const roomId = useRecoilValue(roomIdAtom);

	const [slidesLink, setSlidesLinks] = useRecoilState(slidesLinksAtom);

	const mutation = useMutation({
		mutationFn: (formData: FormData) =>
			axios({
				method: "POST",
				url: `${BACKEND_URL}/slides/${roomId}`,
				data: formData,
				headers: {
					Authorization: `Bearer ${getToken()}`,
					"Content-Type": "multipart/form-data",
				},
			}),

		onSuccess: (response) => {
			setSlidesLinks(response.data.slides);
		},
	});

	const handleSlidesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSlides(e.target.files?.[0]);
	};

	const slideImageChange = (to: "prev" | "next") => {
		if (currSlideIndex === 0 && to === "prev") return;
		if (currSlideIndex === slidesLink.length - 1 && to === "next") return;

		setCurrSlideIndex((prev) => {
			if (to === "next") return prev + 1;
			return prev - 1;
		});
	};

	const handleUploadSlides = () => {
		if (!slides) {
			return;
		}

		if (slides?.size > maxSlidesSize) {
			return;
		}

		const formData = new FormData();
		formData.append("slides", slides);

		mutation.mutate(formData);
	};

	return {
		handleSlidesChange,
		handleUploadSlides,
		slideImageChange,

		currSlideIndex,
	};
};

export default useSlidesTeacher;
