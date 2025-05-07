import React, { useState } from "react";
import {
  Box,
  Button,
  Stepper,
  Step,
  StepLabel,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  Grid,
} from "@mui/material";

const steps = ["Shaxsiy ma'lumotlar", "Tibbiy holat"];

const riskFactors = {
  gender: {
    Мужчина: 1.09,
    Женщина: 0.77,
  },
  age: {
    "18-44": 0.86,
    "45-59": 1.12,
    "60-74": 1.10,
    "75-90": 1.51,
  },
  category: {
    "Впервые выявленные": 0.8,
    "Ранее леченные": 1.34,
    "ВК+": 1.36,
    "ВК-": 0.73,
  },
  clinical: {
    "Очаговый туберкулез (ОТ)": 0.51,
    "Инфильтративный туберкулез (ИТ)": 0.88,
    "Диссеминированный туберкулез (ДТЛ)": 2.95,
    "Туберкулома": 0.66,
    "Кавернозный туберкулез (КТ)": 0.66,
    "Фиброзно-кавернозный туберкулез (ФКТ)": 1.76,
    "Цирротический туберкулез (ЦТ)": 0.80,
    "Милиарный туберкулез (МТ)": 12.00,
    "Казеозная пневмония (КП)": 8.00,
  },
  social: {
    "Бомж": 2.00,
    "Из заключения": 4.00,
    "Злоупотребление алкоголем": 4.85,
    "Употребление наркотиков": 7.00,
  },
  disease: {
    "Анемия": 0.18,
    "Сахарный диабет": 0.93,
    "Онкология": 4.00,
    "ХНЗЛ": 0.70,
    "ССС": 0.89,
    "Язвенная болезнь": 0.88,
    "Гепатиты": 0.90,
    "ХПН": 1.25,
    "ВИЧ-инфекция": 2.21,
  },
};

const getRiskLevel = (score) => {
  if (score <= 1.0) return "Низкий";
  if (score <= 2.0) return "Умеренный";
  if (score <= 4.0) return "Высокий";
  return "Очень высокий";
};

export default function RiskCalculator() {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({});
  const [riskScore, setRiskScore] = useState(null);

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      const {
        gender,
        age,
        category,
        clinical,
        social,
        disease,
      } = formData;

      const score =
        (riskFactors.gender[gender] || 0) +
        (riskFactors.age[age] || 0) +
        (riskFactors.category[category] || 0) +
        (riskFactors.clinical[clinical] || 0) +
        (riskFactors.social[social] || 0) +
        (riskFactors.disease[disease] || 0);

      setRiskScore(score.toFixed(2));
    }

    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => setActiveStep((prev) => prev - 1);

  const handleChange = (field, value) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  return (
    <Box sx={{ width: "100%", p: 4 }}>
      <Stepper activeStep={activeStep}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Card sx={{ mt: 4, borderRadius: 4, boxShadow: 3 }}>
        <CardContent>
          {activeStep === 0 && (
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Jinsi</InputLabel>
                  <Select
                    value={formData.gender || ""}
                    label="Jinsi"
                    onChange={(e) => handleChange("gender", e.target.value)}
                  >
                    <MenuItem value="Мужчина">Мужчина</MenuItem>
                    <MenuItem value="Женщина">Женщина</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Yosh</InputLabel>
                  <Select
                    value={formData.age || ""}
                    label="Yosh"
                    onChange={(e) => handleChange("age", e.target.value)}
                  >
                    {Object.keys(riskFactors.age).map((age) => (
                      <MenuItem key={age} value={age}>
                        {age}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Kategoriya</InputLabel>
                  <Select
                    value={formData.category || ""}
                    label="Kategoriya"
                    onChange={(e) =>
                      handleChange("category", e.target.value)
                    }
                  >
                    {Object.keys(riskFactors.category).map((c) => (
                      <MenuItem key={c} value={c}>
                        {c}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          )}

          {activeStep === 1 && (
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Klinik forma</InputLabel>
                  <Select
                    value={formData.clinical || ""}
                    label="Klinik forma"
                    onChange={(e) =>
                      handleChange("clinical", e.target.value)
                    }
                  >
                    {Object.keys(riskFactors.clinical).map((cf) => (
                      <MenuItem key={cf} value={cf}>
                        {cf}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Ijtimoiy holat</InputLabel>
                  <Select
                    value={formData.social || ""}
                    label="Ijtimoiy holat"
                    onChange={(e) => handleChange("social", e.target.value)}
                  >
                    {Object.keys(riskFactors.social).map((s) => (
                      <MenuItem key={s} value={s}>
                        {s}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Qo‘shimcha kasallik</InputLabel>
                  <Select
                    value={formData.disease || ""}
                    label="Qo‘shimcha kasallik"
                    onChange={(e) => handleChange("disease", e.target.value)}
                  >
                    {Object.keys(riskFactors.disease).map((d) => (
                      <MenuItem key={d} value={d}>
                        {d}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          )}

          {activeStep === steps.length && (
            <Box textAlign="center">
              <Typography variant="h5" sx={{ mt: 2 }}>
                Umumiy ball: <strong>{riskScore}</strong>
              </Typography>
              <Typography
                variant="h6"
                color="secondary"
                sx={{ mt: 1, fontWeight: "bold" }}
              >
                Xavf darajasi: {getRiskLevel(parseFloat(riskScore))}
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
        <Button
          disabled={activeStep === 0}
          onClick={handleBack}
          variant="outlined"
        >
          Orqaga
        </Button>
        {activeStep < steps.length ? (
          <Button variant="contained" onClick={handleNext}>
            Davom etish
          </Button>
        ) : (
          <Button variant="contained" onClick={() => window.location.reload()}>
            Yangi hisob
          </Button>
        )}
      </Box>
    </Box>
  );
}
