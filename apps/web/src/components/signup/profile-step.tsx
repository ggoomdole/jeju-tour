import { useState } from "react";
import Image from "next/image";

import { SignUpForm } from "@/schemas/signup";

import { Camera } from "lucide-react";
import { UseFormReturn } from "react-hook-form";

import FloatingButton from "../common/button/floating-button";

interface ProfileStepProps {
  form: UseFormReturn<SignUpForm>;
  onNext: () => void;
}

const defaultProfile = "/static/default-profile.png";

export default function ProfileStep({ form, onNext }: ProfileStepProps) {
  const [previewImage, setPreviewImage] = useState<string | null>(() => {
    const profileImage = form.getValues("profileImage");
    if (profileImage) {
      return URL.createObjectURL(profileImage);
    }
    return null;
  });

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // 파일 크기 제한 (10MB = 10 * 1024 * 1024 bytes)
      const maxSize = 10 * 1024 * 1024; // 10MB

      if (file.size > maxSize) {
        alert("파일 크기는 10MB 이하여야 해요.");
        e.target.value = ""; // 파일 선택 초기화
        return;
      }

      form.setValue("profileImage", file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  return (
    <>
      <main className="pb-with-floating-button flex flex-col p-5">
        <section className="flex flex-col gap-10">
          <h1 className="typo-bold">
            프로필을
            <br />
            정해주세요
          </h1>
          <label htmlFor="profile-image" className="relative mx-auto w-max cursor-pointer">
            <Image
              src={previewImage || defaultProfile}
              alt="profile"
              width={200}
              height={200}
              className="border-main-700 mx-auto aspect-square rounded-full border object-cover"
            />
            <div className="text-main-900 bg-main-100 border-main-700 absolute bottom-2.5 right-2.5 rounded-full border p-2">
              <Camera />
            </div>
          </label>
          <input
            type="file"
            onChange={onFileChange}
            id="profile-image"
            accept=".png,.jpeg,.jpg,image/png,image/jpeg,image/jpg"
            hidden
          />
        </section>
      </main>
      <FloatingButton onClick={onNext}>다음</FloatingButton>
    </>
  );
}
