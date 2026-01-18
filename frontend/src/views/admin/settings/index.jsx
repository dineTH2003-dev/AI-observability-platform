import Notification from "./components/Notification";
import Upload from "./components/Upload";

const Settings = () => {
  return (
    <div className="flex w-full flex-col gap-5">
      <div className="w-ful mt-3 flex h-fit flex-col gap-5 lg:grid lg:grid-cols-12">

        {/* Notification → 6 cols */}
        <div className="col-span-6 lg:col-span-6 lg:mb-0 3xl:!col-span-6">
          <Notification />
        </div>

        {/* Upload → 6 cols */}
        <div className="z-0 col-span-6 lg:col-span-6 lg:!mb-0">
          <Upload />
        </div>

      </div>
    </div>
  );
};

export default Settings;
