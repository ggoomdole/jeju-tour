"use client";

import { useContext, useState } from "react";
import Image from "next/image";

import Camera from "@/assets/camera.svg";
import Close from "@/assets/close.svg";
import { USER } from "@/constants/user";
import {
  useCheckNicknameDuplicate,
  useUpdateUserNickname,
  useUploadProfileImage,
} from "@/lib/tanstack/mutation/user";
import { revalidateTags } from "@/utils/revalidate";
import { infoToast, successToast } from "@/utils/toast";

import { MypageContext } from "../../context/mypage-context";
import Button from "../common/button";
import { DialogClose, DialogContent, useDialog } from "../common/dialog";

export default function EditProfile() {
  const { nickname: initialNickname, profileImage: initialProfileImage } =
    useContext(MypageContext);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState(initialProfileImage);
  const [nickname, setNickname] = useState(initialNickname || "");
  const [isNicknameChecked, setIsNicknameChecked] = useState(true);

  const { close } = useDialog();

  const { mutateAsync: checkNicknameDuplicate, isPending: isCheckingNickname } =
    useCheckNicknameDuplicate();
  const { mutateAsync: updateUserNickname, isPending: isUpdatingNickname } =
    useUpdateUserNickname();
  const { mutateAsync: uploadProfileImage, isPending: isUploadingProfileImage } =
    useUploadProfileImage();

  const submitDisabled =
    !nickname.trim() ||
    !isNicknameChecked ||
    isCheckingNickname ||
    isUpdatingNickname ||
    isUploadingProfileImage;

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // 파일 크기 제한 (10MB = 10 * 1024 * 1024 bytes)
      const maxSize = 10 * 1024 * 1024; // 10MB

      if (file.size > maxSize) {
        infoToast("파일 크기는 10MB 이하여야 해요.");
        e.target.value = ""; // 파일 선택 초기화
        return;
      }

      setProfileImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let isRevalidateRequired = false;
    if (nickname !== initialNickname) {
      await updateUserNickname(nickname);
      isRevalidateRequired = true;
    }
    if (previewImage.includes("blob") && profileImage) {
      const formData = new FormData();
      formData.append("profile-image", profileImage);
      await uploadProfileImage(formData);
      isRevalidateRequired = true;
    }
    if (isRevalidateRequired) {
      successToast("프로필 수정이 완료되었어요.");
      revalidateTags([USER.GET_USER_INFO]);
    }
    close();
  };

  const onNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === initialNickname) {
      setIsNicknameChecked(true);
    } else {
      setIsNicknameChecked(false);
    }
    setNickname(value);
  };

  const onNicknameCheck = async () => {
    const { data } = await checkNicknameDuplicate(nickname);
    setIsNicknameChecked(data);
  };

  return (
    <DialogContent className="flex flex-col items-center gap-5">
      <div className="flex w-full items-center justify-between">
        <h3 className="typo-semibold">프로필 수정</h3>
        <DialogClose>
          <Close />
        </DialogClose>
      </div>
      <form className="flex w-full flex-col items-center gap-2.5" onSubmit={onSubmit}>
        <label htmlFor="profile-image" className="relative cursor-pointer">
          <Image
            src={previewImage}
            alt="default-profile"
            width={144}
            height={144}
            className="border-main-700 aspect-square rounded-full border object-cover"
          />
          <div className="text-main-900 bg-main-100 border-main-700 absolute bottom-0 right-0 flex size-10 items-center justify-center rounded-full border">
            <Camera />
          </div>
          <input
            type="file"
            onChange={onFileChange}
            id="profile-image"
            accept=".png,.jpeg,.jpg,image/png,image/jpeg,image/jpg"
            hidden
          />
        </label>
        <div className="focus-within:border-b-main-900 flex w-full items-center gap-2.5 border-b-2 border-b-gray-100 py-2.5 transition-colors">
          <input
            placeholder="닉네임을 입력해주세요"
            className="typo-medium w-full"
            value={nickname}
            onChange={onNicknameChange}
          />
          <button
            type="button"
            className="bg-main-900 typo-regular text-nowrap rounded-full px-2 py-1 text-white transition-colors disabled:bg-gray-100 disabled:text-gray-300"
            disabled={isNicknameChecked}
            onClick={onNicknameCheck}
          >
            중복확인
          </button>
        </div>
        <Button type="submit" className="w-full" disabled={submitDisabled}>
          수정하기
        </Button>
      </form>
    </DialogContent>
  );
}
