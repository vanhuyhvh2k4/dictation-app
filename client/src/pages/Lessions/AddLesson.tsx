import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import AddInfoLessonForm from "../../components/form/form-elements/AddInfoLessonForm";
import AddVideoLessonForm from "../../components/form/form-elements/AddVideoLessonForm";

export default function AddLession() {
  return (
    <div>
      <PageMeta
        title="React.js Form Elements Dashboard | TailAdmin - React.js Admin Dashboard Template"
        description="This is React.js Form Elements  Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="Add Lesson" />
      <div className="grid grid-cols-2 gap-2">
        <AddInfoLessonForm />
        <AddVideoLessonForm/>
      </div>
    </div>
  );
}
