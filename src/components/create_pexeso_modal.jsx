import { Dialog } from "@headlessui/react";
import MultipleFileUploader from "./multiple_file_uploader";

export default function CreatePexesoModal({ isModalOpen, closeModal }) {
  return (
    <Dialog
      open={isModalOpen}
      onClose={closeModal}
      className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center"
    >
      <Dialog.Panel className="bg-blue-500 text-white border rounded-md w-full max-w-md p-4">
        <Dialog.Title className="text-xl font-bold mb-2">
          Create new pexeso
        </Dialog.Title>
        <MultipleFileUploader />
      </Dialog.Panel>
    </Dialog>
  );
}
