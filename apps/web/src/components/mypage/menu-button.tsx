import Link from "next/link";

import EditProfile from "./edit-profile";
import Logout from "./logout";
import Withdraw from "./withdraw";
import { Dialog, DialogTrigger } from "../common/dialog";

interface MenuButtonProps {
  name: string;
  value: string;
  type: "link" | "dialog";
}

export default function MenuButton({ name, value, type }: MenuButtonProps) {
  const isLink = type === "link";

  if (isLink) {
    return (
      <li className="border-b border-b-gray-100 px-1 py-5">
        <Link href={`/mypage/${value}`} className="text-start">
          {name}
        </Link>
      </li>
    );
  }

  const renderDialogContent = () => {
    switch (value) {
      case "profile":
        return <EditProfile />;
      case "withdraw":
        return <Withdraw />;
      case "logout":
        return <Logout />;
      default:
        return null;
    }
  };

  return (
    <Dialog>
      <li className="border-b border-b-gray-100 px-1 py-5 text-start">
        <DialogTrigger>{name}</DialogTrigger>
      </li>
      {renderDialogContent()}
    </Dialog>
  );
}
