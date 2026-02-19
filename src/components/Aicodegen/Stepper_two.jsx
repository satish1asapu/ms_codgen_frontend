import React, { useState } from "react";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import "./Stepper_two.css"; // Import your custom CSS file for styling

function Stepper_two() {
  const [individual, setIndividual] = useState(false);
  const [institutions, setInstitutions] = useState(false);
  const [isSeniorCitizen, setIsSeniorCitizen] = useState(false);
  const [residentStatus, setResidentStatus] = useState("Resident");
  const [depositAmount, setDepositAmount] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [investmentPeriod, setInvestmentPeriod] = useState("");
  const [interestPayment, setInterestPayment] = useState([]);

  const handleContinue = () => {
    // Handle form submission here
    // You can access all form values from the state variables
  };

  return (
    <div className="form-container">
      <form className="form_container">
        <div className="form-row">
          <div className="label">
            <label htmlFor="accountType">Select</label>
          </div>
          <div className="checkboxes">
            <FormControl>
              <RadioGroup
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
                name="row-radio-buttons-group"
              >
                <FormControlLabel
                  value="Individual"
                  control={<Radio />}
                  label="Individual"
                />
                <FormControlLabel
                  value="Institutions"
                  control={<Radio />}
                  label="Institutions"
                />
              </RadioGroup>
            </FormControl>
          </div>
        </div>

        <div className="form-row">
          <div className="label">
            <label htmlFor="seniorCitizen">Are you a Senior Citizen?</label>
          </div>
          <div className="checkboxes">
            <FormControl>
              <RadioGroup
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
                name="row-radio-buttons-group"
              >
                <FormControlLabel
                  value="Yes"
                  control={<Radio />}
                  label="Yes"
                />
                <FormControlLabel
                  value="No"
                  control={<Radio />}
                  label="No"
                />
              </RadioGroup>
            </FormControl>
          </div>
        </div>

        <div className="form-row">
          <div className="label">
            <label htmlFor="residentStatus">Resident Status:</label>
          </div>
          <div className="checkboxes">
            <FormControl>
              <RadioGroup
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
                name="row-radio-buttons-group"
              >
                <FormControlLabel
                  value="Resident"
                  control={<Radio />}
                  label="Resident"
                />
                <FormControlLabel
                  value="Non-Resident"
                  control={<Radio />}
                  label="Non-Resident"
                />
              </RadioGroup>
            </FormControl>
          </div>
        </div>
        <div className="divider"></div>
        <div className="form-row">
          <div className="label">
            <label htmlFor="depositAmount">
              Enter Deposit amount
            </label>
          </div>
          <div className="checkboxes">
            <input
              type="number"
              id="depositAmount"
              name="depositAmount"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              placeholder="$"
            />
            {/* <div className="info-text">Minimum Deposit amount 20,000</div> */}
          </div>
        </div>
        <div className="divider"></div>
        <div className="form-row">
          <div className="label">
            <label htmlFor="selectedProduct">Select Product</label>
          </div>
          <div className="checkboxes">
            <FormControl>
              <RadioGroup
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
                name="row-radio-buttons-group"
              >
                <FormControlLabel
                  value="Non-Cumilative"
                  control={<Radio />}
                  label="Non-Cumilative"
                />
                <FormControlLabel
                  value="Cumilative"
                  control={<Radio />}
                  label="Cumilative"
                />
              </RadioGroup>
            </FormControl>
          </div>
        </div>
        <div className="divider"></div>
        <div className="form-row">
          <div className="label">
            <label htmlFor="investmentPeriod">Select Investment period (in Months)</label>
          </div>
          <div className="checkboxes">
            <FormControl>
              <RadioGroup
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
                name="row-radio-buttons-group"
              >
                <FormControlLabel
                  value="12"
                  control={<Radio />}
                  label="12"
                />
                <FormControlLabel
                  value="24"
                  control={<Radio />}
                  label="24"
                />
                <FormControlLabel
                  value="36"
                  control={<Radio />}
                  label="36"
                />
                <FormControlLabel
                  value="48"
                  control={<Radio />}
                  label="48"
                />
                <FormControlLabel
                  value="60"
                  control={<Radio />}
                  label="60"
                />
              </RadioGroup>
            </FormControl>
          </div>
        </div>
        <div className="divider"></div>
        <div className="form-row">
          <div className="label">
            <label htmlFor="interestPayment">Interest Payment</label>
          </div>
          <div className="checkboxes">
            <FormControl>
              <RadioGroup
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
                name="row-radio-buttons-group"
              >
                <FormControlLabel
                  value="Monthly"
                  control={<Radio />}
                  label="Monthly"
                />
                <FormControlLabel
                  value="Quaterly"
                  control={<Radio />}
                  label="Quaterly"
                />
                <FormControlLabel
                  value="Annually"
                  control={<Radio />}
                  label="Annually"
                />
                <FormControlLabel
                  value="On Maturity"
                  control={<Radio />}
                  label="On Maturity"
                />
              </RadioGroup>
            </FormControl>
          </div>
        </div>
      </form>

      {/* <button onClick={handleContinue}>Continue</button> */}
    </div>
  );
}

export default Stepper_two;
