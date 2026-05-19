import { useState } from "react";
import {
  openCamera,
  fetchAlbumPhotos,
  OpenCameraPermissionError,
  FetchAlbumPhotosPermissionError,
} from "@apps-in-toss/web-framework";

export function useQuestionImageUpload(onUpload: (url: string) => void) {
  const [isPhotoSheetOpen, setIsPhotoSheetOpen] = useState(false);

  const handleCamera = async () => {
    try {
      const response = await openCamera({ base64: true, maxWidth: 1280 });
      onUpload(`data:image/jpeg;base64,${response.dataUri}`);
    } catch (error) {
      if (error instanceof OpenCameraPermissionError) {
        await openCamera.openPermissionDialog();
      } else {
        console.error("[useQuestionImageUpload handleCamera]", error);
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
        console.error("[useQuestionImageUpload handleAlbum]", error);
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
