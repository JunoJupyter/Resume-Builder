import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage, FieldArray } from "formik";
import * as Yup from "yup";
import Temp1 from "./images/Template1.png";
import Temp2 from "./images/Template2.png";
import Temp3 from "./images/Template3.png";
import Cross from "./images/Cross.png";
import "./form.css";

const MyForm = () => {
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [selectedURL, setSelectedURL] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const initialValues = {
    template_id: "",
    personal_information: {
      name: "",
      last_name: "",
      email_address: "",
      phone_number: "",
      linkedin_url: "",
    },
    job_title: "",
    career_objective: "",
    skills: [""],
    education: [{ school_name: "", passing_year: "", description: "" }],
    experience: [{ company_name: "", passing_year: "", responsibilities: "" }],
    achievements: [{ field: "", awards: "" }],
  };

  // Creating validation schemas for input fields using Yup

  const validationSchema = Yup.object().shape({
    template_id: Yup.string().required("T ID is required"),
    personal_information: Yup.object().shape({
      name: Yup.string().required("Name is required"),
      last_name: Yup.string().required("Last Name is required"),
      email_address: Yup.string()
        .email("Invalid email")
        .required("Email is required"),
      phone_number: Yup.string()
        .matches(/^\d+$/, "Phone number must contain only digits")
        .required("Phone number is required"),
      linkedin_url: Yup.string()
        .url("Invalid LinkedIn URL")
        .required("LinkedIn URL is required"),
    }),
    job_title: Yup.string().required("Job Title is required"),
    career_objective: Yup.string().required("Objective is required"),
    skills: Yup.array()
      .of(Yup.string())
      .test("at-least-one-skill", "At least one skill is required", (value) => {
        return value && value.length > 0;
      })
      .required("At least one skill is required"),
    education: Yup.array()
      .of(
        Yup.object().shape({
          school_name: Yup.string().required("School is required"),
          passing_year: Yup.string()
            .matches(/^\d+$/, "Passing Year must contain only digits")
            .required("Passing Year is required"),
          description: Yup.string().required("Description is required"),
        })
      )
      .test(
        "at-least-one-education",
        "At least one education is required",
        (value) => {
          return value && value.length > 0;
        }
      )
      .required("At least one education is required"),
    experience: Yup.array()
      .of(
        Yup.object().shape({
          company_name: Yup.string().required("Company is required"),
          passing_year: Yup.string()
            .matches(/^\d+$/, "Passing Year must contain only digits")
            .required("Passing Year is required"),
          responsibilities: Yup.string().required("Responsibility is required"),
        })
      )
      .test(
        "at-least-one-experience",
        "At least one experience is required",
        (value) => {
          return value && value.length > 0;
        }
      )
      .required("At least one experience is required"),
    achievements: Yup.array()
      .of(
        Yup.object().shape({
          field: Yup.string().required("Field is required"),
          awards: Yup.string().required("Award is required"),
        })
      )
      .test(
        "at-least-one-achievement",
        "At least one achievement is required",
        (value) => {
          return value && value.length > 0;
        }
      )
      .required("At least one achievement is required"),
  });

  // Function to trigger POST request on submitting the form

  const handleSubmit = async (values, { setSubmitting }) => {
    setLoading(true);

    try {
      // POST request using fetch
      const response = await fetch("https://resume-builder-server-ten.vercel.app/api/resume", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/pdf",
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        const blob = await response.blob();
        setSelectedURL(URL.createObjectURL(blob));
        setSuccess(true);
      } else {
        setError("Failed to generate resume");
        console.log(error);
      }
    } catch (error) {
      setError(error.message || "Failed to generate resume");
      console.log(error.message);
    }

    setLoading(false);
    setSubmitting(false);
  };

  // Setting "template_id" value based on the selected template
  
  const handleTemplateSelect = (templateId, setFieldValue) => {
    setSelectedTemplate(templateId);
    setFieldValue("template_id", templateId);
  };

  return (
    <div>
      <h1 className="form-heading">Resume Builder</h1>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, isSubmitting, setFieldValue }) => (
          <Form className="form-div">
            <div>
              <label style={{ fontSize: "2.3vw", fontWeight: 600 }}>
                Select Template:
              </label>
              <div className="templates_container">
                <img
                  src={Temp1}
                  alt="Template 1"
                  id="template"
                  className={`templateImage ${
                    selectedTemplate === "1" ? "selectedImage" : ""
                  }`}
                  onClick={() => handleTemplateSelect("1", setFieldValue)}
                />
                <img
                  src={Temp2}
                  alt="Template 2"
                  id="template"
                  className={`templateImage ${
                    selectedTemplate === "2" ? "selectedImage" : ""
                  }`}
                  onClick={() => handleTemplateSelect("2", setFieldValue)}
                />
                <img
                  src={Temp3}
                  alt="Template 3"
                  id="template"
                  className={`templateImage ${
                    selectedTemplate === "3" ? "selectedImage" : ""
                  }`}
                  onClick={() => handleTemplateSelect("3", setFieldValue)}
                />
              </div>
            </div>

            <div className="templateEnd"></div>

            <h1 className="pinfoheading">Personal Information</h1>

            <div className="field-container">
              <div>
                <label className="label" htmlFor="personal_information.name">
                  Name:
                </label>
                <br />
                <Field
                  type="text"
                  className="inputfield1"
                  id="personal_information.name"
                  name="personal_information.name"
                />
                <ErrorMessage
                  className="errormessage"
                  name="personal_information.name"
                  component="div"
                />
              </div>

              <div>
                <label
                  htmlFor="personal_information.last_name"
                  className="label"
                >
                  Last Name:
                </label>
                <br />
                <Field
                  type="text"
                  className="inputfield1"
                  id="personal_information.last_name"
                  name="personal_information.last_name"
                />
                <ErrorMessage
                  className="errormessage"
                  name="personal_information.last_name"
                  component="div"
                />
              </div>

              <div>
                <label
                  htmlFor="personal_information.email_address"
                  className="label"
                >
                  Email:
                </label>
                <br />
                <Field
                  type="text"
                  className="inputfield1"
                  id="personal_information.email_address"
                  name="personal_information.email_address"
                />
                <ErrorMessage
                  className="errormessage"
                  name="personal_information.email_address"
                  component="div"
                />
              </div>

              <div>
                <label
                  htmlFor="personal_information.phone_number"
                  className="label"
                >
                  Phone Number:
                </label>
                <br />
                <Field
                  type="text"
                  className="inputfield1"
                  id="personal_information.phone_number"
                  name="personal_information.phone_number"
                />
                <ErrorMessage
                  className="errormessage"
                  name="personal_information.phone_number"
                  component="div"
                />
              </div>

              <div>
                <label
                  htmlFor="personal_information.linkedin_url"
                  className="label"
                >
                  LinkedIn:
                </label>
                <br />
                <Field
                  type="text"
                  className="inputfield1"
                  id="personal_information.linkedin_url"
                  name="personal_information.linkedin_url"
                />
                <ErrorMessage
                  className="errormessage"
                  name="personal_information.linkedin_url"
                  component="div"
                />
              </div>
            </div>

            <div className="templateEnd" style={{ marginTop: "5%" }}></div>

            <h1 className="pinfoheading">Job Description</h1>

            <div className="field-container">
              <div>
                <label htmlFor="job_title" className="label">
                  Job Title:
                </label>
                <br />
                <Field
                  type="text"
                  id="job_title"
                  name="job_title"
                  className="inputfield1"
                />
                <ErrorMessage
                  className="errormessage"
                  name="job_title"
                  component="div"
                />
              </div>

              <div>
                <label htmlFor="career_objective" className="label">
                  Career Objective:
                </label>
                <br />
                <Field
                  as="textarea"
                  id="career_objective"
                  className="inputfield-textarea"
                  name="career_objective"
                />
                <ErrorMessage
                  className="errormessage"
                  name="career_objective"
                  component="div"
                />
              </div>
            </div>

            <div className="templateEnd" style={{ marginTop: "5%" }}></div>

            <h1>
              <label htmlFor="skills">Skills:</label>
            </h1>
            <br />
            <div className="field-container">
              <FieldArray name="skills">
                {(arrayHelpers) => (
                  <div>
                    {arrayHelpers.form.values.skills.map((skill, index) => (
                      <div key={index} className="dynamic-field-str">
                        <Field
                          type="text"
                          name={`skills[${index}]`}
                          className="inputfield1"
                        />
                        <ErrorMessage
                          className="errormessage"
                          name={`skills[${index}]`}
                          component="div"
                        />
                        {index > 0 && (
                          <button
                            type="button"
                            className="removeSkillbtn"
                            onClick={() => arrayHelpers.remove(index)}
                          >
                            Remove Skill
                          </button>
                        )}
                        <div
                          className="innertemplateEnd"
                          style={{ marginTop: "5%" }}
                        ></div>
                      </div>
                    ))}
                    <button
                      type="button"
                      className="addskillbtn"
                      onClick={() => arrayHelpers.push("")}
                    >
                      Add Skill
                    </button>
                  </div>
                )}
              </FieldArray>
            </div>

            <div className="templateEnd" style={{ marginTop: "5%" }}></div>

            <h1>
              <label className="pinfoheading" htmlFor="education">
                Education:
              </label>
            </h1>
            <div className="field-container-edu">
              <FieldArray name="education">
                {(arrayHelpers) => (
                  <div>
                    {arrayHelpers.form.values.education.map((edu, index) => (
                      <div key={index} className="dynamic-field-str">
                        <div>
                          <label
                            className="label"
                            htmlFor={`education[${index}].school_name`}
                          >
                            School:
                          </label>
                          <br />
                          <Field
                            type="text"
                            className="inputfield1"
                            name={`education[${index}].school_name`}
                          />
                          <ErrorMessage
                            className="errormessage"
                            name={`education[${index}].school_name`}
                            component="div"
                          />
                        </div>
                        <div>
                          <label
                            className="label"
                            htmlFor={`education[${index}].passing_year`}
                          >
                            Passing Year:
                          </label>
                          <br />
                          <Field
                            type="text"
                            className="inputfield1"
                            name={`education[${index}].passing_year`}
                          />
                          <ErrorMessage
                            className="errormessage"
                            name={`education[${index}].passing_year`}
                            component="div"
                          />
                        </div>
                        <div>
                          <label
                            className="label"
                            htmlFor={`education[${index}].description`}
                          >
                            Description:
                          </label>
                          <br />
                          <Field
                            as="textarea"
                            className="inputfield1"
                            name={`education[${index}].description`}
                          />
                          <ErrorMessage
                            className="errormessage"
                            name={`education[${index}].description`}
                            component="div"
                          />
                        </div>
                        {index > 0 && (
                          <button
                            type="button"
                            onClick={() => arrayHelpers.remove(index)}
                            className="rmEdubtn"
                          >
                            Remove Education
                          </button>
                        )}
                        <div
                          className="innertemplateEnd"
                          style={{ marginTop: "5%" }}
                        ></div>
                      </div>
                    ))}
                    {arrayHelpers.form.values.education.length === 0 && (
                      <div>No education fields added. Add at least one.</div>
                    )}
                    <button
                      type="button"
                      onClick={() =>
                        arrayHelpers.push({
                          school_name: "",
                          passing_year: "",
                          description: "",
                        })
                      }
                      className="addEdubtn"
                    >
                      Add Education
                    </button>
                  </div>
                )}
              </FieldArray>
            </div>

            <div className="templateEnd" style={{ marginTop: "5%" }}></div>

            <div>
              <h1>
                <label className="pinfoheading" htmlFor="experience">
                  Experience:
                </label>
              </h1>
              <FieldArray name="experience">
                {(arrayHelpers) => (
                  <div>
                    {arrayHelpers.form.values.experience.map((exp, index) => (
                      <div key={index} className="dynamic-field-str">
                        <div>
                          <label
                            className="label"
                            htmlFor={`experience[${index}].company_name`}
                          >
                            Company:
                          </label>
                          <br />
                          <Field
                            type="text"
                            className="inputfield1"
                            name={`experience[${index}].company_name`}
                          />
                          <ErrorMessage
                            className="errormessage"
                            name={`experience[${index}].company_name`}
                            component="div"
                          />
                        </div>
                        <div>
                          <label
                            className="label"
                            htmlFor={`experience[${index}].passing_year`}
                          >
                            Passing Year:
                          </label>
                          <br />
                          <Field
                            type="text"
                            className="inputfield1"
                            name={`experience[${index}].passing_year`}
                          />
                          <ErrorMessage
                            className="errormessage"
                            name={`experience[${index}].passing_year`}
                            component="div"
                          />
                        </div>
                        <div>
                          <label
                            className="label"
                            htmlFor={`experience[${index}].responsibilities`}
                          >
                            Responsibility:
                          </label>
                          <br />
                          <Field
                            as="textarea"
                            className="inputfield1"
                            name={`experience[${index}].responsibilities`}
                          />
                          <ErrorMessage
                            className="errormessage"
                            name={`experience[${index}].responsibilities`}
                            component="div"
                          />
                        </div>
                        {index > 0 && (
                          <button
                            type="button"
                            onClick={() => arrayHelpers.remove(index)}
                            className="rmExpbtn"
                          >
                            Remove Experience
                          </button>
                        )}
                        <div
                          className="innertemplateEnd"
                          style={{ marginTop: "5%" }}
                        ></div>
                      </div>
                    ))}
                    {arrayHelpers.form.values.experience.length === 0 && (
                      <div>No experience fields added. Add at least one.</div>
                    )}
                    <button
                      type="button"
                      onClick={() =>
                        arrayHelpers.push({
                          company_name: "",
                          passing_year: "",
                          responsibilities: "",
                        })
                      }
                      className="addExpbtn"
                    >
                      Add Experience
                    </button>
                  </div>
                )}
              </FieldArray>
            </div>

            <div className="templateEnd" style={{ marginTop: "5%" }}></div>

            <div>
              <h1>
                <label className="pinfoheading" htmlFor="achievements">
                  Achievements:
                </label>
              </h1>
              <FieldArray name="achievements">
                {(arrayHelpers) => (
                  <div>
                    {arrayHelpers.form.values.achievements.map((ach, index) => (
                      <div key={index} className="dynamic-field-str">
                        <div>
                          <label
                            className="label"
                            htmlFor={`achievements[${index}].field`}
                          >
                            Field:
                          </label>
                          <br />
                          <Field
                            type="text"
                            className="inputfield1"
                            name={`achievements[${index}].field`}
                          />
                          <ErrorMessage
                            className="errormessage"
                            name={`achievements[${index}].field`}
                            component="div"
                          />
                        </div>
                        <div>
                          <label
                            className="label"
                            htmlFor={`achievements[${index}].awards`}
                          >
                            Award:
                          </label>
                          <br />
                          <Field
                            type="text"
                            className="inputfield1"
                            name={`achievements[${index}].awards`}
                          />
                          <ErrorMessage
                            className="errormessage"
                            name={`achievements[${index}].awards`}
                            component="div"
                          />
                        </div>
                        {index > 0 && (
                          <button
                            type="button"
                            onClick={() => arrayHelpers.remove(index)}
                            className="rmAchbtn"
                          >
                            Remove Achievement
                          </button>
                        )}
                        <div
                          className="innertemplateEnd"
                          style={{ marginTop: "5%" }}
                        ></div>
                      </div>
                    ))}
                    {arrayHelpers.form.values.achievements.length === 0 && (
                      <div>No achievement fields added. Add at least one.</div>
                    )}
                    {arrayHelpers.form.values.achievements.length > 0 && (
                      <button
                        type="button"
                        onClick={() =>
                          arrayHelpers.push({ field: "", awards: "" })
                        }
                        className="addAchbtn"
                      >
                        Add Achievement
                      </button>
                    )}
                  </div>
                )}
              </FieldArray>
            </div>

            <div className="templateEnd" style={{ marginTop: "5%" }}></div>

            <button className="submitbtn" type="submit" disabled={isSubmitting}>
              {loading ? "Generating Resume..." : "Submit"}
            </button>
          </Form>
        )}
      </Formik>

      {loading && (
        <div className="popup">
          <div className="popup-inner">
            <div className="loading-spinner"></div>
            <p>Generating Your Resume...</p>
          </div>
        </div>
      )}

      {success && (
        <div className="popup">
          <div className="popup-inner">
            <img
              src={Cross}
              alt=""
              className="popup-cross"
              onClick={() => setSuccess(false)}
            />
            <p>Resume Created Successfully!</p>
            <button onClick={() => window.open(selectedURL, "_blank")}>
              Preview
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="popup">
          <div className="popup-inner">
            <img
              src={Cross}
              alt=""
              className="popup-cross"
              onClick={() => setError(null)}
            />
            <p>PDF Generation Failed: {error}</p>
            <button onClick={() => setError(null)}>Go Back</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyForm;
