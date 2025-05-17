import React, { useState } from 'react';
import {
  Stepper, Step, StepLabel, Button, TextField, Select, MenuItem,
  Container, Typography, FormControl, InputLabel, Box, RadioGroup, FormControlLabel, Radio,
  Dialog, DialogContent, Slide
} from '@mui/material';
import { keyframes } from '@emotion/react'; // For custom keyframes
import { styled } from '@mui/system'; // For styled components

// Keyframes for animations
const fadeIn = keyframes`
  from { opacity: 0; transform: scale(0.9); }
  to { opacity: 1; transform: scale(1); }
`;

const fadeOut = keyframes`
  from { opacity: 1; transform: scale(1); }
  to { opacity: 0; transform: scale(0.9); }
`;

// Styled DialogContent for custom backgrounds and animation
const StyledDialogContent = styled(DialogContent)`
  background-color: ${props => props.bgColor || 'white'};
  color: white;
  padding: 30px;
  text-align: center;
  border-radius: 12px;
  animation: ${fadeIn} 0.3s ease-out;

  &.exiting { /* Class added when dialog starts to close */
    animation: ${fadeOut} 0.3s ease-in forwards;
  }
`;

// Transition component for the dialog
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function App() {
  const [statsionar, setStatsionar] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    fullName: '',
    gender: '',
    birthYear: '',
    age: '',
    category: '',
    tuberculosisType: '',
    socialStatus: [],
    chronicDiseases: [],
    baktyerioVideleniya: '',
    oslojeniya: '',
    questions: [],
  });
  const [score, setScore] = useState(0);
  const [factorResult, setFactorResult] = useState(1);
  const [logresult, setLogResult] = useState(1);

  // New states for the custom dialog
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogTitle, setDialogTitle] = useState('');
  const [dialogMessage, setDialogMessage] = useState('');
  const [dialogBgColor, setDialogBgColor] = useState('');

  const steps = ['Шаг 1: Персональная информация', 'Шаг 2: Медицинская информация', 'Шаг 3: Опросник Мориски'];

  // Factor coefficients (no changes here)
  const GENDER_FACTORS = {
    'Мужской': 1.09,
    'Женский': 0.77,
  };

  const AGE_FACTORS = {
    '18-44': 0.86,
    '45-59': 1.12,
    '60-74': 1.10,
    '75-90': 1.51,
  };

  const CATEGORY_FACTORS = {
    'Впервые выявленные': 0.80,
    'Ранее леченные': 1.34,
  };

  const VIDELENIYA_FACTORS = {
    'ВК+': 1.36,
    'ВК-': 0.73,
  };

  const CLINICAL_FACTORS = {
    'Очаговый туберкулез (ОТ)': 0.51,
    'Инфильтративный туберкулез (ИТ)': 0.88,
    'Диссеминированный туберкулез (ДТЛ)': 2.95,
    'Туберкулома': 0.66,
    'Кавернозный туберкулез (КТ)': 0.66,
    'Фиброзно-кавернозный туберкулез (ФКТ)': 1.76,
    'Цирротический туберкулез (ЦТ)': 0.80,
    'Милиарный туберкулез (МТ)': 12.00,
    'Казеозная пневмония (КП)': 8.00,
    'Генерализованный туберкулез': 100,
  };

  const SOCIAL_FACTORS = {
    'Бомж': 2.00,
    'Из заключения': 4.00,
    'Злоупотребление алкоголем': 4.85,
    'Употребление наркотиков': 7.00,
  };

  const COMORBIDITY_FACTORS = {
    'Анемия': 0.18,
    'Сахарный диабет': 0.93,
    'Онкология': 4.00,
    'ХНЗЛ': 0.70,
    'ССС': 0.89,
    'Язвенная болезнь': 0.88,
    'Гепатиты': 0.90,
    'ХПН': 1.25,
    'ВИЧ-инфекция': 2.21,
    'Психические заболевания': 100,
    'Беременность': 100,
  };

  const OSLOJENIYA_FACTORS = {
    "Жизнеугрожающие (Кровохаркание, кровотечение, спонтанный пневмоторакс)": 1000,
  };

  const handleNext = () => {
    setActiveStep(prev => prev + 1);
  };

  const handleBack = () => {
    setActiveStep(prev => prev - 1);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedFormData = {
      ...formData,
      [name]: value,
    };
    setFormData(updatedFormData);

    // Calculate factors based on updatedFormData
    const genderFactor = GENDER_FACTORS[updatedFormData.gender] || 1;
    const ageFactor = AGE_FACTORS[updatedFormData.age] || 1;
    const categoryFactor = CATEGORY_FACTORS[updatedFormData.category] || 1;
    const clinicalFactor = CLINICAL_FACTORS[updatedFormData.tuberculosisType] || 1;
    const videleniyaFactor = VIDELENIYA_FACTORS[updatedFormData.baktyerioVideleniya] || 1;
    const oslojeniyaFactor = OSLOJENIYA_FACTORS[updatedFormData.oslojeniya] || 1;

    // Calculate social and comorbidity factors
    const socialFactor = Array.isArray(updatedFormData.socialStatus)
      ? updatedFormData.socialStatus.reduce(
          (total, status) => total * (SOCIAL_FACTORS[status] ?? 1),
          1
        )
      : 1;

    const comorbidityFactor = Array.isArray(updatedFormData.chronicDiseases)
      ? updatedFormData.chronicDiseases.reduce(
          (total, disease) => total * (COMORBIDITY_FACTORS[disease] ?? 1),
          1
        )
      : 1;

    // Calculate total factor
    const total = genderFactor * ageFactor * categoryFactor * clinicalFactor * socialFactor * comorbidityFactor * videleniyaFactor * oslojeniyaFactor;

    console.log("Raw Total before log:", total);
    console.log({
      genderFactor,
      ageFactor,
      categoryFactor,
      clinicalFactor,
      socialFactor,
      comorbidityFactor,
      videleniyaFactor,
      oslojeniyaFactor,
    });

    setFactorResult(total);
    setLogResult(Math.log10(total).toFixed(4));

    // Check for "Стационар" conditions
    if (updatedFormData.oslojeniya === "Жизнеугрожающие (Кровохаркание, кровотечение, спонтанный пневмоторакс)" ||
        updatedFormData.chronicDiseases.includes("Беременность") ||
        updatedFormData.chronicDiseases.includes("Психические заболевания") ||
        updatedFormData.tuberculosisType === "Генерализованный туберкулез") {
      setStatsionar(true);
    } else {
      setStatsionar(false); // Reset if conditions are no longer met
    }
  };

  const questions = [
    "Забываете ли Вы иногда принять лекарства?",
    "Бывает ли, что в течение последних двух недель Вы не принимали лекарства хотя бы один день?",
    "Бывало ли, что Вы прекращали принимать лекарства, не сообщая об этом врачу, потому что почувствовали себя хуже?",
    "Когда Вы путешествуете или покидаете дом, забываете ли Вы брать с собой лекарства?",
    "Вчера Вы принимали лекарства?",
    "Когда чувствуете себя лучше, бывает ли, что прекращаете принимать лекарства?",
    "Если чувствуете себя хуже после приёма лекарства, прекращаете ли Вы его приём?",
    "Как часто Вы пропускаете приём лекарства?"
  ];

  const handleQuestionChange = (index, value) => {
    const updatedQuestions = [...formData.questions];
    updatedQuestions[index] = value;
    setFormData({ ...formData, questions: updatedQuestions });
  };

  const showResultDialog = (title, message, bgColor) => {
    setDialogTitle(title);
    setDialogMessage(message);
    setDialogBgColor(bgColor);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    // Reset form and state after closing the dialog
    setActiveStep(0);
    setFormData({
      fullName: '',
      gender: '',
      birthYear: '',
      age: '',
      category: '',
      tuberculosisType: '',
      socialStatus: [],
      chronicDiseases: [],
      baktyerioVideleniya: '',
      oslojeniya: '',
      questions: [],
    });
    setScore(0);
    setFactorResult(1);
    setLogResult(1);
    setStatsionar(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let totalMoriScore = 0;
    formData.questions.forEach(answer => {
      if (answer === 'yes') {
        totalMoriScore += 1;
      }
      if (answer === "Редко") {
        totalMoriScore += 0.25;
      }
      if (answer === "Иногда") {
        totalMoriScore += 0.5;
      }
      if (answer === "Очень часто") {
        totalMoriScore += 1;
      }
      if (answer === "Часто") {
        totalMoriScore += 0.75;
      }
    });
    setScore(totalMoriScore);
    console.log("Mori score at submission:", totalMoriScore);

    if (statsionar) {
      showResultDialog(`Стационар`, `Рекомендуется стационарное лечение.`, '#e57373'); // Red background
      console.log("Recommended: Стационар (due to specific conditions)");
    } else {
      // Logic for different risk categories and adherence
      if (logresult >= -2.3012 && logresult <= -0.2678) {
        if (totalMoriScore === 0) {
          showResultDialog(`Амбулаторная модель`, `Пациенту рекомендована амбулаторная модель лечения.`, '#66bb6a'); // Green background
          console.log("Category 1: Амбулаторная модель");
        } else if (totalMoriScore === 1 || totalMoriScore === 2) {
          showResultDialog(`Амбулаторная модель`, `Пациенту рекомендована амбулаторная модель, при возможности полного контроля, ВКЛ.`, '#66bb6a'); // Green background
          console.log("Category 2: Амбулаторная модель, при возможности полного контроля, ВКЛ");
        } else if (totalMoriScore >= 3) {
          showResultDialog(`Амбулаторная модель`, `Пациенту рекомендована амбулаторная модель, при условии повышения приверженности, ВКЛ.`, '#66bb6a'); // Green background
          console.log("Category 3: Амбулаторная модель, при условии повышения приверженности, ВКЛ");
        }
      } else if (logresult > -0.2678 && logresult <= 1.7656) {
        if (totalMoriScore === 0) {
          showResultDialog(`Амбулаторная модель`, `Пациенту рекомендована амбулаторная модель лечения.`, '#66bb6a'); // Green background
          console.log("Category 4: Амбулаторная модель");
        } else if (totalMoriScore === 1 || totalMoriScore === 2) {
          showResultDialog(`Мобильная группа на транспорте`, `Пациенту рекомендована амбулаторная модель (Мобильная группа на транспорте).`, '#ffeb3b'); // Yellow background
          console.log("Category 5: Амбулаторная модель (Мобильная группа на транспорте)");
        } else if (totalMoriScore >= 3) {
          showResultDialog(`Мобильная группа на транспорте`, `Возможно амбулаторная модель (Мобильная группа на транспорте).`, '#ffeb3b'); // Yellow background
          console.log("Category 6: Возможно амбулаторная модель (Мобильная группа на транспорте)");
        }
      } else if (logresult > 1.7656 && logresult <= 3.7990) {
        showResultDialog(`Стационар`, `Пациенту рекомендовано стационарное лечение.`, '#e57373'); // Red background
        console.log("Category 7-9: Стационар");
      } else if (logresult > 3.7990 && logresult <= 5.8323) {
        showResultDialog(`Стационар`, `Пациенту рекомендовано стационарное лечение.`, '#e57373'); // Red background
        console.log("Category 10-12: Стационар");
      } else {
        showResultDialog(`Ошибка`, `Результат лог-шкалы вне определенных категорий: ${logresult}.`, '#9e9e9e'); // Grey background
        console.log("Log result falls outside defined categories:", logresult);
      }
    }

    console.log('Final calculated log result:', logresult);
  };

  const handleClick = (e) => {
    if (activeStep === steps.length - 1) {
      handleSubmit(e);
    } else {
      handleNext();
    }
  };

  return (
    <div
      style={{
        backgroundImage: "url(/assets/fon.jpg)",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Container maxWidth="md" style={{
        maxHeight: '900px',
        backgroundColor: 'white',
        padding: '20px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
        borderRadius: '12px',
        marginTop: '50px',
      }}>
        <Box my={4}>
          <Typography variant="h4" gutterBottom>Оценка риска заболевания</Typography>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label, index) => (
              <Step key={index}><StepLabel>{label}</StepLabel></Step>
            ))}
          </Stepper>

          <Box my={3}>
            {activeStep === 0 && (
              <>
                <TextField label="ФИО" name="fullName" fullWidth margin="normal" value={formData.fullName} onChange={handleChange} />
                <FormControl fullWidth margin="normal">
                  <InputLabel>Пол</InputLabel>
                  <Select name="gender" value={formData.gender} onChange={handleChange} label="Пол">
                    <MenuItem value="Мужской">Мужской</MenuItem>
                    <MenuItem value="Женский">Женский</MenuItem>
                  </Select>
                </FormControl>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Возраст</InputLabel>
                  <Select name="age" value={formData.age} onChange={handleChange} label="Возраст">
                    <MenuItem value="18-44">18-44</MenuItem>
                    <MenuItem value="45-59">45-59</MenuItem>
                    <MenuItem value="60-74">60-74</MenuItem>
                    <MenuItem value="75-90">75-90</MenuItem>
                  </Select>
                </FormControl>
              </>
            )}

            {activeStep === 1 && (
              <>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Категория</InputLabel>
                  <Select name="category" value={formData.category} onChange={handleChange} label="Категория">
                    <MenuItem value="Впервые выявленные">Впервые выявленные</MenuItem>
                    <MenuItem value="Ранее леченные">Ранее леченные</MenuItem>
                  </Select>
                </FormControl>

                <FormControl fullWidth margin="normal">
                  <InputLabel>Бактерио выделения</InputLabel>
                  <Select name="baktyerioVideleniya" value={formData.baktyerioVideleniya} onChange={handleChange} label="Бактерио выделения">
                    <MenuItem value="ВК+">ВК+</MenuItem>
                    <MenuItem value="ВК-">ВК-</MenuItem>
                  </Select>
                </FormControl>

                <FormControl fullWidth margin="normal">
                  <InputLabel>Тип туберкулеза</InputLabel>
                  <Select name="tuberculosisType" value={formData.tuberculosisType} onChange={handleChange} label="Тип туберкулеза">
                    {Object.keys(CLINICAL_FACTORS).map((key) => <MenuItem value={key} key={key}>{key}</MenuItem>)}
                  </Select>
                </FormControl>

                <FormControl fullWidth margin="normal">
                  <InputLabel>Социальный статус</InputLabel>
                  <Select
                    name="socialStatus"
                    multiple
                    value={formData.socialStatus}
                    onChange={handleChange}
                    label="Социальный статус"
                    renderValue={(selected) => Array.isArray(selected) ? selected.join(', ') : ''}
                  >
                    {Object.keys(SOCIAL_FACTORS).map((key) => <MenuItem value={key} key={key}>{key}</MenuItem>)}
                  </Select>
                </FormControl>

                <FormControl fullWidth margin="normal">
                  <InputLabel>Хронические заболевания</InputLabel>
                  <Select
                    name="chronicDiseases"
                    multiple
                    value={formData.chronicDiseases}
                    onChange={handleChange}
                    label="Хронические заболевания"
                    renderValue={(selected) => Array.isArray(selected) ? selected.join(', ') : ''}>
                    {Object.keys(COMORBIDITY_FACTORS).map((key) => <MenuItem value={key} key={key}>{key}</MenuItem>)}
                  </Select>
                </FormControl>

                <FormControl fullWidth margin="normal">
                  <InputLabel>Осложнения</InputLabel>
                  <Select name="oslojeniya" value={formData.oslojeniya} onChange={handleChange} label="Осложнения">
                    {Object.keys(OSLOJENIYA_FACTORS).map((key) => <MenuItem value={key} key={key}>{key}</MenuItem>)}
                  </Select>
                </FormControl>
              </>
            )}

            {activeStep === 2 && (
              <Box sx={{ maxHeight: '400px', overflowY: 'auto', pr: 2 }}>
                {questions.map((question, index) => (
                  <Box key={index} my={2}>
                    <Typography>{question}</Typography>
                    {index === 7 ? (
                      <RadioGroup
                        row
                        value={formData.questions[index] || ''}
                        onChange={(e) => handleQuestionChange(index, e.target.value)}
                      >
                        <FormControlLabel value='Никогда' control={<Radio />} label="Никогда" />
                        <FormControlLabel value="Редко" control={<Radio />} label="Редко" />
                        <FormControlLabel value="Иногда" control={<Radio />} label="Иногда" />
                        <FormControlLabel value="Часто" control={<Radio />} label="Часто" />
                        <FormControlLabel value="Очень часто" control={<Radio />} label="Очень часто" />
                      </RadioGroup>
                    ) : (
                      <RadioGroup
                        row
                        value={formData.questions[index] || ''}
                        onChange={(e) => handleQuestionChange(index, e.target.value)}
                      >
                        <FormControlLabel value="yes" control={<Radio />} label="Да" />
                        <FormControlLabel value="no" control={<Radio />} label="Нет" />
                      </RadioGroup>
                    )}
                  </Box>
                ))}
              </Box>
            )}
          </Box>

          <Box mt={2} display="flex" justifyContent="space-between">
            <Button disabled={activeStep === 0} onClick={handleBack}>Назад</Button>
            <Button variant="contained" color="primary" onClick={handleClick}>
              {activeStep === steps.length - 1 ? 'Отправить' : 'Далее'}
            </Button>
          </Box>
        </Box>
      </Container>

      {/* Custom Result Dialog */}
      <Dialog
        open={openDialog}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleCloseDialog}
        aria-describedby="alert-dialog-slide-description"
        PaperProps={{
          sx: {
            borderRadius: '12px',
            backgroundColor: 'transparent', // Make Paper background transparent
            boxShadow: 'none', // Remove default shadow
            width: 'fit-content', // Adjust width to content
            maxWidth: '90%', // Max width for responsiveness
          }
        }}
      >
        <StyledDialogContent bgColor={dialogBgColor} className={openDialog ? '' : 'exiting'}>
          <Typography variant="h5" component="div" sx={{ mb: 2, fontWeight: 'bold' }}>
            {dialogTitle}
          </Typography>
          <Typography variant="body1" id="alert-dialog-slide-description">
            {dialogMessage}
          </Typography>
          <Button onClick={handleCloseDialog} color="inherit" sx={{ mt: 3, borderColor: 'white', color: 'white', '&:hover': { borderColor: 'white', backgroundColor: 'rgba(255,255,255,0.1)' } }} variant="outlined">
            ОК
          </Button>
        </StyledDialogContent>
      </Dialog>
    </div>
  );
}

export default App;