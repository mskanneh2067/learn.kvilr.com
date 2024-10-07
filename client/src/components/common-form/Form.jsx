import React from "react";
import FormControls from "./FormControls";
import { Button } from "../ui/button";

const Form = ({
  handleSubmit,
  buttonText,
  formControls = [],
  formData,
  setFormData,
  isButtonDisabled = false
}) => {
  return (
    <form onSubmit={handleSubmit}>
      {/* Render all form controls here */}
      <FormControls
        formControls={formControls}
        formData={formData}
        setFormData={setFormData}
      />

      <Button disabled={isButtonDisabled} type="submit" className="mt-4 w-full">{buttonText || "Submit"}</Button>
    </form>
  );
};

export default Form;
