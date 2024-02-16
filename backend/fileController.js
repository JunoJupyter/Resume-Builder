import generatePDF from "./PdfGenerator.js";
import fs from 'fs';
import { Buffer } from 'buffer'

export const dataUpload = async (req, res) => {

  // Storing the form data in the variables as required in the JSON to be used for Document Generation API

  const {
    template_id,
    personal_information,
    job_title,
    career_objective,
    skills,
    education,
    experience,
    achievements,
  } = req.body;


  // Checking template validation

  const validTemplateIds = ["1", "2", "3"];
  if (!validTemplateIds.includes(template_id)) {

    // Error Code: 404 --> Template not found

    return res.status(404).json({ error: `Template not found! Invalid Template: ${template_id}` });
  }


  // Destructuring the personal information array received from request, to get required details

  const personal_informationRequiredFields = [
    "name",
    "last_name",
    "email_address",
    "phone_number",
    "linkedin_url",
  ];
  const personal_informationMissingFields =
    personal_informationRequiredFields.filter(
      (field) => !personal_information.hasOwnProperty(field)
    );

  if (personal_informationMissingFields.length > 0) {
    return res.status(400).json({
      error: `Bad Request! Missing required fields in personal_information: ${personal_informationMissingFields.join(
        ", "
      )}`,
    });
  }

  const { name, last_name, email_address, phone_number, linkedin_url } =
    personal_information;


    // Creating the JSON object to be used in Document Generation API

  const transformedJson = {
    Name: name,
    LastName: last_name,
    EmailAddress: email_address,
    PhoneNumber: phone_number,
    LinkedIn: `<a href="${linkedin_url}">LinkedIn</a>`,
    JobTitle: job_title,
    Summary: career_objective,
    Skills: skills,
    Education: education.map((edu) => ({
      SchoolName: edu.school_name,
      Year: edu.passing_year,
      Description: edu.description,
    })),
    Experience: experience.map((exp) => ({
      CompanyName: exp.company_name,
      Year: exp.passing_year,
      Description: exp.responsibilities,
    })),
    Achievements: achievements.map((ach) => ({
      Type: ach.field,
      Description: ach.awards,
    })),
  };

  let outputFile = `./output/cv.pdf`;

  let templateFilePath;
  if (template_id === "1") {
    templateFilePath = "../Templates/BasicTemplate.docx";
  } else if (template_id === "2") {
    templateFilePath = "../Templates/LinkTemplate.docx";
  } else if (template_id === "3") {
    templateFilePath = "../Templates/ImageTemplate.docx";
  } else {
    return res.status(404).json({ error: `Invalid Template ID: ${template_id}, Template Not Found!` });
  }


  // Calling function to start Resume Creation

  await generatePDF(templateFilePath, transformedJson, outputFile)
  .then((output_path) => {
    console.log("PDF generated successfully");
    
    const pdfData = fs.readFileSync(outputFile);

    // Set the appropriate headers for the response
    res.setHeader('Content-Disposition', 'attachment; filename=cv.pdf');
    res.setHeader('Content-Type', 'application/pdf');

    // Send the PDF file as the response
    res.send(pdfData);
  })
  .catch((error) => {
    console.error("PDF generation failed:", error);
    return res.status(401).json({ error: "Unauthorised" });
  });  
};
