"use client";

import Image from "next/image";

import Camera from "@/assets/camera.svg";
import Close from "@/assets/close.svg";
import { DragCarousel, DragCarouselItem } from "@/components/common/carousel/drag-carousel";
import { Dialog, DialogContent, DialogTrigger, useDialog } from "@/components/common/dialog";
import RegisterStarRating from "@/components/common/star/register-star-rating";
import StarRating from "@/components/common/star/star-rating";
import { REVIEW } from "@/constants/review";
import { invalidateQueries } from "@/lib/tanstack";
import { useCreateReview } from "@/lib/tanstack/mutation/review";
import { type ReviewLocationForm, reviewLocationFormSchema } from "@/schemas/location";
import { infoToast, successToast } from "@/utils/toast";
import { zodResolver } from "@hookform/resolvers/zod";

import { FieldErrors, useForm } from "react-hook-form";

interface RegisterReviewProps {
  locationId: string;
  currentUserId: string | null;
}

function RegisterReviewDialogContent({ locationId }: Omit<RegisterReviewProps, "currentUserId">) {
  const { mutateAsync: createReview, isPending } = useCreateReview();
  const { close } = useDialog();

  const { register, handleSubmit, setValue, watch, reset } = useForm<ReviewLocationForm>({
    resolver: zodResolver(reviewLocationFormSchema),
    defaultValues: {
      review: "",
      images: undefined,
      rating: 0,
    },
  });
  const images = watch("images");
  const previewImages = images ? Array.from(images).map((image) => URL.createObjectURL(image)) : [];

  const onRemoveImage = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();

    if (!images) return;

    const newImages = Array.from(images).filter((_, i) => i !== index);
    const newFileList = new DataTransfer();
    newImages.forEach((file) => newFileList.items.add(file));

    setValue("images", newFileList.files);
  };

  const onImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = e.target.files;
    if (!newFiles) return;

    const currentCount = images?.length || 0;
    const newCount = newFiles.length;

    // 최대 5개 이미지 제한
    if (currentCount + newCount > 5) {
      return infoToast("이미지는 최대 5개까지 업로드 가능해요.");
    }

    const newFileList = new DataTransfer();

    if (images) {
      Array.from(images).forEach((file) => {
        newFileList.items.add(file);
      });
    }

    Array.from(newFiles).forEach((file) => {
      newFileList.items.add(file);
    });

    setValue("images", newFileList.files);
  };

  const onRegisterReview = async (data: ReviewLocationForm) => {
    const formData = new FormData();
    const body = {
      spotId: locationId,
      content: data.review,
      rate: data.rating,
    };
    formData.append("data", JSON.stringify(body));
    if (data.images) {
      Array.from(data.images).forEach((file) => {
        formData.append("review-image", file);
      });
    }

    try {
      await createReview(formData);
      successToast("리뷰가 등록되었어요.");
      invalidateQueries([REVIEW.GET_REVIEWS_BY_ID, locationId]);
      close();
      reset();
    } catch (error) {
      console.error(error);
    }
  };

  const onError = (errors: FieldErrors<ReviewLocationForm>) => {
    if (errors.rating) {
      return infoToast(errors.rating.message!);
    }
    if (errors.review) {
      return infoToast(errors.review.message!);
    }
  };

  return (
    <DialogContent>
      <div className="flex items-center gap-1">
        <p className="typo-medium text-gray-900">솔직 후기</p>
        <RegisterStarRating
          rating={watch("rating")}
          className="size-5"
          onRatingChange={(rating) => setValue("rating", rating)}
        />
      </div>
      <form className="flex flex-col gap-2.5" onSubmit={handleSubmit(onRegisterReview, onError)}>
        <textarea
          className="bg-main-100 typo-regular min-h-40 w-full resize-none rounded-xl p-2.5"
          placeholder="후기를 남겨주세요."
          {...register("review")}
        />
        <DragCarousel>
          {(!images || images.length < 5) && (
            <DragCarouselItem>
              <label
                htmlFor="image-upload"
                className="bg-main-100 text-main-900 border-main-700 flex size-24 cursor-pointer items-center justify-center rounded-xl border"
              >
                <Camera />
              </label>
            </DragCarouselItem>
          )}
          {previewImages?.map((image, index) => (
            <DragCarouselItem key={`${index}-${image}`}>
              <div className="relative aspect-square size-24">
                <Image src={image} alt="review-image" fill className="rounded-xl object-cover" />
                <button
                  type="button"
                  onClick={(e) => onRemoveImage(index, e)}
                  aria-label="이미지 삭제"
                >
                  <Close className="bg-main-900 absolute right-2 top-2 size-5 rounded-full p-0.5 text-white" />
                </button>
              </div>
            </DragCarouselItem>
          ))}
        </DragCarousel>
        <input
          type="file"
          hidden
          accept="image/*"
          multiple
          id="image-upload"
          onChange={onImageUpload}
        />
        <button
          type="submit"
          disabled={isPending}
          className="bg-main-100 typo-regular disabled:bg-main-200 self-end rounded-xl px-2.5 py-1 text-gray-900"
        >
          {isPending ? "리뷰 등록 중..." : "리뷰 등록"}
        </button>
      </form>
    </DialogContent>
  );
}

export default function RegisterReview({ currentUserId, locationId }: RegisterReviewProps) {
  return (
    <Dialog>
      <DialogTrigger className="flex" disabled={currentUserId === null}>
        <StarRating rating={0} className="size-5" />
      </DialogTrigger>
      <RegisterReviewDialogContent locationId={locationId} />
    </Dialog>
  );
}
