import { useRef, useState } from "react";
import Image from "next/image";

import Lock from "@/assets/lock.svg";
import Plus from "@/assets/plus.svg";
import Button from "@/components/common/button";
import { Dialog, DialogClose, DialogContent, DialogTrigger } from "@/components/common/dialog";
import Header from "@/components/common/header";
import { COURSE_CATEGORIES } from "@/constants/category";
import {
  useCheckRoadNameDuplicate,
  useRemoveRoad,
  useUpdateRoad,
  useUploadRoad,
} from "@/lib/tanstack/mutation/road";
import { useCreateMyRoad } from "@/lib/tanstack/mutation/road";
import { cn } from "@/lib/utils";
import { UploadCourseForm } from "@/schemas/course";
import { CoursePlaceProps } from "@/types/course";
import { errorToast, infoToast, successToast } from "@/utils/toast";

import { useFieldArray, UseFormReturn } from "react-hook-form";

import ChangeOrderMode from "./change-order-mode";
import DefaultMode from "./default-mode";
import NewCourses from "./new-courses";

interface CreateTabProps {
  id?: string;
  form: UseFormReturn<UploadCourseForm>;
  isEditCourse: boolean;
  isPrivate: boolean;
  view: "private" | "duplicate";
  previewImage: string | null;
  initialTitle: string;
  isNameAvailable: boolean;
  setPreviewImage: (image: string | null) => void;
  setIsNameAvailable: (isNameAvailable: boolean) => void;
}

const CATEGORIES = COURSE_CATEGORIES.slice(1);
const MAX_FILE_SIZE = 5 * 1024 * 1024;

const getHeaderText = (isEditCourse: boolean, isPrivate: boolean) => {
  if (isPrivate) {
    return "나만의 순례길";
  }
  return isEditCourse ? "순례길 수정하기" : "순례길 생성하기";
};

export default function CreateTab({
  id,
  form,
  isEditCourse,
  isPrivate,
  view,
  previewImage,
  initialTitle,
  isNameAvailable,
  setPreviewImage,
  setIsNameAvailable,
}: CreateTabProps) {
  const isDuplicate = view === "duplicate";

  const [isEditOrderMode, setIsEditOrderMode] = useState(false);
  const prevImageUrl = useRef<File | null>(form.getValues("imageUrl"));

  const title = form.watch("title");

  const { mutateAsync: uploadRoad, isPending: isUploadingRoad } = useUploadRoad();
  const { mutateAsync: checkRoadNameDuplicate, isPending: isCheckingDuplicate } =
    useCheckRoadNameDuplicate();
  const { mutateAsync: updateRoad, isPending: isUpdatingRoad } = useUpdateRoad();
  const { mutateAsync: createMyRoad, isPending: isCreatingRoad } = useCreateMyRoad();
  const { mutateAsync: removeRoad, isPending: isRemovingRoad } = useRemoveRoad();

  const categoryId = form.watch("categoryId");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const { fields, update, remove } = useFieldArray({
    control: form.control,
    name: "spots",
    keyName: "fieldId",
  });

  const duplicateButtonDisabled = isCheckingDuplicate || isNameAvailable || title === initialTitle;
  const submitDisabled =
    !form.formState.isValid ||
    fields.length < 3 ||
    isEditOrderMode ||
    isUploadingRoad ||
    isCheckingDuplicate ||
    !isNameAvailable ||
    isUpdatingRoad ||
    isCreatingRoad ||
    isRemovingRoad;

  const onChangeReason = (index: number, reason: string) => {
    update(index, {
      ...fields[index],
      reason,
    });
  };

  const onCheckRoadNameDuplicate = async () => {
    const isDuplicate = await checkRoadNameDuplicate(form.getValues("title"));
    if (!isDuplicate.data) {
      setIsNameAvailable(false);
      infoToast("이미 존재하는 순례길 이름이에요.");
    } else {
      setIsNameAvailable(true);
      successToast("사용 가능한 순례길 이름이에요.");
    }
  };

  const onReorder = (newOrder: CoursePlaceProps[]) => {
    form.setValue("spots", newOrder);
  };

  const onChangeCategory = (categoryPath: string) => {
    if (categoryId === +categoryPath) return;
    form.setValue("categoryId", +categoryPath);
  };

  const onTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value === initialTitle) {
      setIsNameAvailable(true);
    }
    setIsNameAvailable(false);
  };

  const onFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        return infoToast("파일 크기는 5MB 이하여야 해요.");
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      form.setValue("imageUrl", file);
    }
  };

  const onImageClick = () => {
    fileInputRef.current?.click();
  };

  const onDeleteCourse = async () => {
    await removeRoad(id || "");
  };

  const onSubmit = form.handleSubmit(
    async (data) => {
      const formData = new FormData();
      const spots = data.spots.map((spot, index) => ({
        number: index + 1,
        spotId: spot.placeId,
        name: spot.placeName,
        introSpot: spot.reason,
        address: spot.address,
        latitude: spot.latitude,
        longitude: spot.longitude,
      }));
      const body = {
        title: data.title,
        categoryId: data.categoryId,
        intro: data.intro,
        spots,
      };
      formData.append("data", JSON.stringify(body));
      if (isDuplicate) {
        if (data.imageUrl) {
          let file = data.imageUrl;
          if (data.imageUrl.name.startsWith("https://")) {
            const res = await fetch(data.imageUrl.name);

            if (!res.ok) throw new Error("이미지 요청 실패");

            const blob = await res.blob();

            file = new File([blob], `origin-road-image-${id}`, { type: blob.type });
          }
          formData.append("road-image", file);
        }
        await createMyRoad(formData);
      } else if (isEditCourse && id) {
        if (prevImageUrl.current !== data.imageUrl && data.imageUrl) {
          formData.append("update-road-image", data.imageUrl);
        }
        await updateRoad({ formData, roadId: id });
      } else {
        if (data.imageUrl) {
          formData.append("road-image", data.imageUrl);
        }
        await uploadRoad({ formData });
      }
    },
    (error) => {
      errorToast("순례길 생성에 실패했어요.");
      console.error(error);
    }
  );

  return (
    <>
      <Header>{getHeaderText(isEditCourse, isPrivate)}</Header>
      <main className="pb-navigation">
        <section className="bg-main-100 relative p-5">
          <div className="mb-2.5 flex gap-5">
            <div
              className="group relative size-28 shrink-0 cursor-pointer overflow-hidden rounded-2xl bg-gray-100"
              onClick={onImageClick}
            >
              {previewImage ? (
                <>
                  <Image
                    src={previewImage}
                    alt="순례길 썸네일"
                    className="aspect-square shrink-0 object-cover transition-all group-hover:brightness-50"
                    width={112}
                    height={112}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <button
                      onClick={onImageClick}
                      className="text-white opacity-0 transition-opacity group-hover:opacity-100"
                      aria-label="이미지 제거"
                    >
                      <Plus />
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex size-full flex-col items-center justify-center text-gray-500">
                  <Plus />
                  <span className="text-xs">이미지 추가</span>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept=".png, .jpg, .jpeg"
                onChange={onFileSelect}
                className="hidden"
                aria-label="이미지 파일 선택"
              />
            </div>
            <div className="flex w-full flex-col justify-between">
              <div className="focus-within:border-b-main-900 flex w-full items-center gap-2.5 border-b-2 border-b-gray-100 py-2.5 transition-colors">
                <input
                  placeholder="순례길 이름을 정해주세요"
                  className="typo-medium w-full"
                  {...form.register("title", {
                    onChange: onTitleChange,
                  })}
                />
                <button
                  onClick={onCheckRoadNameDuplicate}
                  disabled={duplicateButtonDisabled}
                  className="bg-main-900 typo-regular text-nowrap rounded-full px-2 py-1 text-white transition-colors disabled:bg-gray-100 disabled:text-gray-300"
                >
                  중복확인
                </button>
              </div>
              <div className="typo-regular space-y-1">
                <p>해당하는 카테고리를 선택해주세요.</p>
                <div className="space-x-2.5">
                  {CATEGORIES.map((categoryItem) => (
                    <button
                      key={categoryItem.name}
                      className={cn(
                        "rounded-full px-4 py-1",
                        categoryId === +categoryItem.path && "bg-main-700"
                      )}
                      onClick={() => onChangeCategory(categoryItem.path)}
                    >
                      {categoryItem.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <textarea
            placeholder="순례길 소개를 입력해주세요"
            className="typo-regular w-full resize-none rounded-xl bg-white p-2.5"
            {...form.register("intro")}
          />
          {isEditOrderMode && (
            <div className="typo-semibold backdrop-blur-xs absolute inset-0 flex flex-col items-center justify-center gap-2.5 bg-black/40 text-center text-white">
              <Lock className="size-12" />
              <p>순례길 코스 편집을 완료해주세요</p>
            </div>
          )}
        </section>
        <section className="flex flex-1 flex-col p-5">
          <div className="flex items-center justify-between">
            <h2 className="typo-semibold">순례길 코스</h2>
            <button
              className="typo-regular underline"
              onClick={() => setIsEditOrderMode(!isEditOrderMode)}
            >
              {isEditOrderMode ? "완료" : "편집"}
            </button>
          </div>
          {isEditOrderMode ? (
            <ChangeOrderMode
              fields={fields}
              onChangeReason={onChangeReason}
              remove={remove}
              onReorder={onReorder}
            />
          ) : (
            <DefaultMode
              id={id}
              fields={fields}
              view={view}
              onChangeReason={onChangeReason}
              remove={remove}
            />
          )}
          {isEditCourse && !isPrivate && !isDuplicate && <NewCourses id={id || ""} />}
          {isEditCourse ? (
            <div className="flex gap-5 py-5">
              {!isDuplicate && (
                <Dialog>
                  <DialogTrigger className="typo-semibold flex-1 rounded-xl bg-gradient-to-r from-red-300 to-red-500 py-5 text-white">
                    삭제하기
                  </DialogTrigger>
                  <DialogContent className="space-y-5 text-center">
                    <h3 className="typo-semibold">삭제하시겠습니까?</h3>
                    <p className="typo-medium">삭제된 순례길은 복구할 수 없어요.</p>
                    <div className="flex gap-2.5">
                      <DialogClose className="typo-semibold from-main-700 to-main-900 flex-1 rounded-xl bg-gradient-to-r py-5 text-white">
                        취소
                      </DialogClose>
                      <Button className="flex-1" variant="warning" onClick={onDeleteCourse}>
                        삭제
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
              <Button disabled={submitDisabled} className="flex-1" onClick={onSubmit}>
                {isDuplicate ? "생성하기" : "수정하기"}
              </Button>
            </div>
          ) : (
            <Button disabled={submitDisabled} onClick={onSubmit}>
              {isUploadingRoad ? "생성중..." : "생성하기"}
            </Button>
          )}
        </section>
      </main>
    </>
  );
}
