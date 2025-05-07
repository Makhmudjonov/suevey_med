import React, { useState, useEffect } from 'react';
import {
  Stepper, Step, StepLabel, Button, TextField, Select, MenuItem,
  Container, Typography, FormControl, InputLabel, Box, RadioGroup, FormControlLabel, Radio
} from '@mui/material';

function App() {

  const [categoryRisk, setCategoryRisk] = useState(null);

  

  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    fullName: '',
    gender: '',
    birthYear: '',
    age: '',
    category: '',
    tuberculosisType: '',
    socialStatus: '',
    chronicDiseases: '',
    questions: [],
  });
  const [score, setScore] = useState(0);

  const steps = ['Шаг 1: Персональная информация', 'Шаг 2: Медицинская информация', 'Шаг 3: Опросник Мориски'];

  useEffect(() => {
    if (formData.birthYear && /^\d{4}$/.test(formData.birthYear)) {
      const currentYear = new Date().getFullYear();
      const age = currentYear - parseInt(formData.birthYear);
      setFormData(prev => ({ ...prev, age: age.toString() }));
    }
  }, [formData.birthYear]);

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      let totalScore = score;
      formData.questions.forEach(answer => {
        if (answer === 'yes') {
          totalScore += 1;
        }
        if (answer === "Редко") {
          totalScore += 0.25
        }
        if (answer === "Иногда") {
          totalScore += 0.5
        }

        if (answer === "Очень часто") {
          totalScore += 1
        }
        if (answer === "Часто") {
          totalScore += 0.75
        }

      });
      alert(`Форма отправлена. Общий балл риска: ${totalScore.toFixed(2)}`);
    } else {
      setActiveStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep(prev => prev - 1);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    let addedScore = 0;
    if (name === 'category') {
      if (value === 'Впервые выявленные') addedScore = 0.80;
      else if (value === 'Ранее леченные') addedScore = 1.34;
      else if (value === 'ВК+') addedScore = 1.36;
      else if (value === 'ВК-') addedScore = 0.73;
    }

    if (name === 'tuberculosisType') {
      const tbScores = {
        'Очаговый туберкулез (ОТ)': 0.51,
        'Инфильтративный туберкулез (ИТ)': 0.88,
        'Диссеминированный туберкулез (ДТЛ)': 2.95,
        'Туберкулома': 0.66,
        'Кавернозный туберкулез (КТ)': 0.66,
        'Фиброзно-кавернозный туберкулез (ФКТ)': 1.76,
        'Цирротический туберкулез (ЦТ)': 0.80,
        'Милиарный туберкулез (МТ)': 12.00,
        'Казеозная пневмония (КП)': 8.00,
        'Генерализованный туберкулез': 0.00,
      }; 
      addedScore = tbScores[value] || 0;
    }

    if (name === 'socialStatus') {
      const socialScores = {
        'Бомж': 2.00,
        'Из заключения': 4.00,
        'Злоупотребление алкоголем': 4.85,
        'Употребление наркотиков': 7.00,
      };
      addedScore = socialScores[value] || 0;
    }

    if (name === 'chronicDiseases') {
      const diseaseScores = {
        'Анемия': 0.18,
        'Сахарный диабет': 0.93,
        'Онкология': 4.00,
        'ХНЗЛ': 0.70,
        'ССС': 0.89,
        'Язвенная болезнь': 0.88,
        'Гепатиты': 0.90,
        'ХПН': 1.25,
        'ВИЧ-инфекция': 2.21,
        'Психические заболевания': 0.0,
        'Беременность': 0.0,
      };
      addedScore = diseaseScores[value] || 0;
    }

    if ([
      'category', 'tuberculosisType', 'socialStatus', 'chronicDiseases'
    ].includes(name)) {
      setScore(prev => prev + addedScore);
    }
  };

  // if (
  //   ['ДТЛ', 'МТ', 'КП'].includes(formData.tuberculosisType) ||
  //   formData.chronicDiseases === 'Онкология' ||
  //   formData.chronicDiseases === 'ВИЧ-инфекция' ||
  //   ['Бомж', 'Из заключения', 'Злоупотребление алкоголем', 'Употребление наркотиков'].includes(formData.socialStatus)
  // ) {
  //   categoryRisk = 'Очень высокий риск';
  // } else if (
  //   ( formData.age >= 75 && formData.age <= 90) ||
  //   formData.tuberculosisType === 'Фиброзно-кавернозный туберкулез (ФКТ)'
  // ) {
  //   categoryRisk = 'Высокий риск';
  // } else if (
  //   formData.gender === 'Мужской' ||
  //   (formData.age >= 45 && formData.age <= 74) ||
  //   formData.category === 'Ранее леченные' ||
  //   formData.category === 'ВК+'
  // ) {
  //   categoryRisk = 'Умеренный риск';
  // } else if (
  //   formData.gender === 'Женский' &&
  //   formData.age >= 18 && formData.age <= 44
  // ) {
  //   categoryRisk = 'Низкий риск';
  // }

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
    const updated = [...formData.questions];
    updated[index] = value;
    setFormData({ ...formData, questions: updated });
  };

  return (
    <Container maxWidth="sm">
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
    {[...Array(100)].map((_, i) => (
      <MenuItem key={i + 1} value={i + 1}>
        {i + 1}
      </MenuItem>
    ))}
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
                  <MenuItem value="ВК+">ВК+</MenuItem>
                  <MenuItem value="ВК-">ВК-</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth margin="normal">
                <InputLabel>Тип туберкулеза</InputLabel>
                <Select name="tuberculosisType" value={formData.tuberculosisType} onChange={handleChange} label="Тип туберкулеза">
                  {Object.keys({
                    'Очаговый туберкулез (ОТ)': '',
                    'Инфильтративный туберкулез (ИТ)': '',
                    'Диссеминированный туберкулез (ДТЛ)': '',
                    'Туберкулома': '',
                    'Кавернозный туберкулез (КТ)': '',
                    'Фиброзно-кавернозный туберкулез (ФКТ)': '',
                    'Цирротический туберкулез (ЦТ)': '',
                    'Милиарный туберкулез (МТ)': '',
                    'Казеозная пневмония (КП)': '',
                    'Генерализованный туберкулез': 0.00,
                  }).map((key) => <MenuItem value={key} key={key}>{key}</MenuItem>)}
                </Select>
              </FormControl>

              <FormControl fullWidth margin="normal">
                <InputLabel>Социальный статус</InputLabel>
                <Select name="socialStatus" value={formData.socialStatus} onChange={handleChange} label="Социальный статус">
                  <MenuItem value="Бомж">Бомж</MenuItem>
                  <MenuItem value="Из заключения">Из заключения</MenuItem>
                  <MenuItem value="Злоупотребление алкоголем">Злоупотребление алкоголем</MenuItem>
                  <MenuItem value="Употребление наркотиков">Употребление наркотиков</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth margin="normal">
                <InputLabel>Хронические заболевания</InputLabel>
                <Select name="chronicDiseases" value={formData.chronicDiseases} onChange={handleChange} label="Хронические заболевания">
                  <MenuItem value="Анемия">Анемия</MenuItem>
                  <MenuItem value="Сахарный диабет">Сахарный диабет</MenuItem>
                  <MenuItem value="Онкология">Онкология</MenuItem>
                  <MenuItem value="ХНЗЛ">ХНЗЛ</MenuItem>
                  <MenuItem value="ССС">ССС</MenuItem>
                  <MenuItem value="Язвенная болезнь">Язвенная болезнь</MenuItem>
                  <MenuItem value="Гепатиты">Гепатиты</MenuItem>
                  <MenuItem value="ХПН">ХПН</MenuItem>
                  <MenuItem value="ВИЧ-инфекция">ВИЧ-инфекция</MenuItem>
                  <MenuItem value="Психические заболевания">Психические заболевания</MenuItem>
                  <MenuItem value="Беременность">Беременность</MenuItem>
                </Select>
              </FormControl>
            </>
          )}

{activeStep === 2 && (
  <>
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
  </>
)}

        </Box>

        <Box mt={2} display="flex" justifyContent="space-between">
          <Button disabled={activeStep === 0} onClick={handleBack}>Назад</Button>
          <Button variant="contained" color="primary" onClick={handleNext}>{activeStep === steps.length - 1 ? 'Отправить' : 'Далее'}</Button>
        </Box>
      </Box>
    </Container>
  );
}

export default App;
