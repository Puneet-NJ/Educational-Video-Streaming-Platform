import { BACKEND_URL } from "@/lib/lib";
import axios from "axios";
import { useState } from "react";
import useToken from "./useToken";
import { useMutation } from "@tanstack/react-query";
import { useRecoilState, useSetRecoilState } from "recoil";
import { currSlideAtom, roomIdAtom, slidesLinksAtom } from "@/lib/atom";
import { queryClient } from "@/lib/Providers";

const useSlidesTeacher = (
	handleChangeScene: (
		activeScene: "slides" | "board" | "default" | "screen",
		slide?: number
	) => void
) => {
	const [slides, setSlides] = useState<File>();
	// const [currSlideIndex, setCurrSlideIndex] = useState(0);

	const maxSlidesSize = 5 * 1000000;
	const { getToken } = useToken();
	const roomId = useRecoilState(roomIdAtom)[0];
	const [slidesLink, setSlidesLinks] = useRecoilState(slidesLinksAtom);
	const [currSlideIndex, setCurrSlideIndex] = useRecoilState(currSlideAtom);

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
			setSlidesLinks(response.data.slides); // Update Recoil state
			queryClient.setQueryData(["slides"], () => response.data.slides); // Update cache

			setCurrSlideIndex(0);
			handleChangeScene("slides", 0);
		},
	});

	const handleSlidesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSlides(e.target.files?.[0]);
	};

	const slideImageChange = (to: "prev" | "next") => {
		if (currSlideIndex === 0 && to === "prev") return;
		if (currSlideIndex === slidesLink.length - 1 && to === "next") return;

		let slideChangeVal = currSlideIndex || 0;
		setCurrSlideIndex((prev) => {
			if (to === "next") {
				slideChangeVal = prev! + 1;
				return prev! + 1;
			}

			slideChangeVal = prev! - 1;
			return prev! - 1;
		});
		handleChangeScene("slides", slideChangeVal);
	};

	const handleUploadSlides = () => {
		if (!slides) return;
		if (slides?.size > maxSlidesSize) return;

		const formData = new FormData();
		formData.append("slides", slides);
		mutation.mutate(formData);
	};

	return {
		handleSlidesChange,
		handleUploadSlides,
		slideImageChange,
	};
};

export default useSlidesTeacher;
