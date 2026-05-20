import { useState } from "react";
import { useToast } from "@toss/tds-mobile";
import {
  openCamera,
  fetchAlbumPhotos,
  OpenCameraPermissionError,
  FetchAlbumPhotosPermissionError,
} from "@apps-in-toss/web-framework";

export function useQuestionImageUpload(onUpload: (url: string) => void) {
  const [isPhotoSheetOpen, setIsPhotoSheetOpen] = useState(false);
  const { openToast } = useToast();

  const handleCamera = async () => {
    try {
      const response = await openCamera({ base64: true, maxWidth: 1280 });
      onUpload(`data:image/jpeg;base64,${response.dataUri}`);
    } catch (error) {
      if (error instanceof OpenCameraPermissionError) {
        await openCamera.openPermissionDialog();
      } else {
        openToast("이미지를 불러오는 중 오류가 발생했어요.", { type: "bottom" });
      }
    }
  };

  const handleAlbum = async () => {
    try {
      const response = await fetchAlbumPhotos({ base64: true, maxWidth: 1280, maxCount: 1 });
      if (response[0]) {
        onUpload(`data:image/jpeg;base64,${response[0].dataUri}`);
      }
    } catch (error) {
      if (error instanceof FetchAlbumPhotosPermissionError) {
        await fetchAlbumPhotos.openPermissionDialog();
      } else {
        openToast("이미지를 불러오는 중 오류가 발생했어요.", { type: "bottom" });
      }
    }
  };

  return {
    isPhotoSheetOpen,
    openPhotoSheet: () => setIsPhotoSheetOpen(true),
    closePhotoSheet: () => setIsPhotoSheetOpen(false),
    handleCamera,
    handleAlbum,
  };
}
