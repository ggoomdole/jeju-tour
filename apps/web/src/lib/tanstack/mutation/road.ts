import { useRouter } from "next/navigation";

import { ROAD } from "@/constants/road";
import {
  checkRoadNameDuplicate,
  createMyRoad,
  participateRoad,
  removeRoad,
  updateRoad,
  uploadRoad,
  withdrawRoad,
} from "@/services/road";
import { revalidatePath, revalidateTags } from "@/utils/revalidate";
import { errorToast, infoToast, successToast } from "@/utils/toast";
import { useMutation } from "@tanstack/react-query";

import { invalidateMany, invalidateQueries } from "..";

export const useUploadRoad = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: uploadRoad,
    onSuccess: () => {
      successToast("순례길 생성이 완료되었어요.");
      invalidateQueries([ROAD.ALL_ROADS]);
      revalidateTags([ROAD.PARTICIPATIONS]);
      router.push("/courses");
    },
  });
};

export const useCheckRoadNameDuplicate = () => {
  return useMutation({
    mutationFn: checkRoadNameDuplicate,
  });
};

export const useUpdateRoad = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: updateRoad,
    onSuccess: () => {
      successToast("순례길 수정이 완료되었어요.");
      invalidateQueries([ROAD.ALL_ROADS]);
      revalidateTags([ROAD.PARTICIPATIONS]);
      router.back();
    },
  });
};

export const useCreateMyRoad = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: createMyRoad,
    onSuccess: () => {
      successToast("나만의 순례길 생성이 완료되었어요.");
      revalidateTags([ROAD.PARTICIPATIONS]);
      router.replace("/mypage/courses");
    },
  });
};

export const useParticipateRoad = () => {
  return useMutation({
    mutationFn: participateRoad,
    onSuccess: (data) => {
      if (data.message === "이미 참여중인 순례길입니다.") {
        infoToast("이미 참여중인 순례길입니다.");
        return;
      }
      successToast("순례길 참여가 완료되었어요.");
      invalidateQueries([ROAD.PARTICIPATIONS]);
      revalidatePath(`/courses/${data.data.pilgrimageId}`);
    },
    onError: () => {
      errorToast("순례길 참여에 실패했어요.");
    },
  });
};

export const useRemoveRoad = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: removeRoad,
    onSuccess: () => {
      successToast("순례길 삭제가 완료되었어요.");
      invalidateMany([
        [ROAD.ALL_ROADS],
        [ROAD.DETAIL],
        [ROAD.MY_CUSTOM_ROADS],
        [ROAD.PARTICIPATIONS],
        [ROAD.RECOMMEND],
      ]);
      revalidateTags([ROAD.MY_CUSTOM_ROADS, ROAD.PARTICIPATIONS]);
      router.back();
    },
    onError: () => {
      errorToast("순례길 삭제에 실패했어요.");
    },
  });
};

export const useWithdrawRoad = () => {
  return useMutation({
    mutationFn: withdrawRoad,
    onSuccess: (data) => {
      successToast("순례길 탈퇴가 완료되었어요.");
      revalidateTags([ROAD.PARTICIPATIONS]);
      revalidatePath(`/courses/${data.data}`);
    },
    onError: () => {
      errorToast("순례길 탈퇴에 실패했어요.");
    },
  });
};
