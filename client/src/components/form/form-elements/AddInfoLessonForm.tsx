import ComponentCard from "../../common/ComponentCard";
import Label from "../Label";
import Input from "../input/InputField";
import Select from "../Select";
import FileInput from "../input/FileInput";

export default function AddInfoLessonForm() {
  const options = [
    { value: "marketing", label: "Marketing" },
    { value: "template", label: "Template" },
    { value: "development", label: "Development" },
  ];

  const handleSelectChange = (value: string) => {
    console.log("Selected value:", value);
  };

  return (
    <ComponentCard title="Lesson Information">
      <div className="space-y-6">
        <div>
          <Label>Lesson title</Label>
          <div className="relative">
            <Input placeholder="Enter lesson title" type="text" />
          </div>
        </div>
        <div>
          <Label>Channel</Label>
          <div className="relative">
            <Input placeholder="Enter lesson title" type="text" />
          </div>
        </div>
        <div>
          <Label>Lesson level</Label>
          <Select
            options={options}
            placeholder="Select Option"
            onChange={handleSelectChange}
            className="dark:bg-dark-900"
          />
        </div>
        <div>
          <Label>Lesson thumbnail</Label>
          <FileInput/>
        </div>
      </div>
    </ComponentCard>
  );
}
