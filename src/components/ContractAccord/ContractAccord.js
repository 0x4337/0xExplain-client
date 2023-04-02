import "./ContractAccord.scss";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useState } from "react";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";

import {
  duotoneSea,
  oneDark,
  twilight,
  atomDark,
  moonscript,
} from "react-syntax-highlighter/dist/esm/styles/prism";

const ContractAccord = ({ contract }) => {
  const [isClicked, setIsClicked] = useState(false);

  const handleGptClick = () => {
    setIsClicked(true);
  };

  return (
    <section className="accord">
      <Accordion
        sx={{
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          color: "white",
          border: "1px solid grey",
        }}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <div className="accord">
            <Typography fontSize="2rem" fontFamily="lalo">
              Contract Name
            </Typography>
            <Typography fontSize="1.6rem" fontFamily="lalo" color="grey">
              Contract 1 of 15
            </Typography>
          </div>
        </AccordionSummary>
        <AccordionDetails>
          <div className="gpt">
            <button onClick={handleGptClick} className="gpt__button">
              0xExplain
            </button>
          </div>
          <Typography fontFamily="lalo" fontSize="1.6rem">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Culpa vel,
            totam aliquam autem provident unde eligendi corrupti quis qui?
            Delectus doloremque, possimus distinctio maiores consequuntur
            quisquam deserunt? Quod, odio voluptatibus?
          </Typography>

          <SyntaxHighlighter
            showLineNumbers
            language="solidity"
            wrapLongLines={true}
            style={duotoneSea}
          >
            {contract}
          </SyntaxHighlighter>
        </AccordionDetails>
      </Accordion>
    </section>
  );
};

export default ContractAccord;