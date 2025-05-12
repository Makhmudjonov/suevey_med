import React, { useState, useEffect } from 'react';
import {
  Stepper, Step, StepLabel, Button, TextField, Select, MenuItem,
  Container, Typography, FormControl, InputLabel, Box, RadioGroup, FormControlLabel, Radio
} from '@mui/material';




function App() {

  const [categoryRisk, setCategoryRisk] = useState(null);

  const [selectedValues, setSelectedValues] = useState([]);


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
      // if (condition) {
      //   alert(`Форма отправлена. Общий балл риска: ${totalScore.toFixed(2)}`);
      // }

      // Birinchi toifa: og‘ir holatlar
const firstGroup = [
  'Диссеминированный туберкулез (ДТЛ)',
  'Милиарный туберкулез (МТ)',
  'Казеозная пневмония (КП)',
  'ВИЧ-инфекция',
  'Бомж',
  'Из заключения',
  'Злоупотребление алкоголем',
  'Употребление наркотиков',
  'Онкология',
];

// Ikkinchi toifa: 75–90 va ФКТ
const secondTbc = 'Фиброзно-кавернозный туберкулез (ФКТ)';

// Uchinchi toifa
const thirdGroup = ['Мужской', 'Ранее леченные', 'ВК+'];

// To‘rtinchi toifa
const fourthGroup = [
  'Женский',
  'Впервые выявленные',
  'ВК-',
  'Очаговый туберкулез (ОТ)',
  'Инфильтративный туберкулез (ИТ)',
  'Туберкулома',
  'Кавернозный туберкулез (КТ)',
  'Цирротический туберкулез (ЦТ)',
  'Анемия',
  'Сахарный диабет',
  'ХНЗЛ',
  'ССС',
  'Язвенная болезнь',
  'Гепатиты'
]; 

// selectedValues ichidagi sonni ajratamiz (yosh bo‘lishi mumkin)
const numberValues = selectedValues.filter(v => !isNaN(parseInt(v)));
const number = numberValues.length > 0 ? parseInt(numberValues[0]) : null;

// 1-if
const isFirst = firstGroup.some(item => selectedValues.includes(item));

if (isFirst) {
  console.log("1-guruh: og‘ir holatlar");
}

// 2-if
const isSecond = number >= 75 && number <= 90 && selectedValues.includes(secondTbc);

if (isSecond) {
  console.log("2-guruh: yoshi 75-90, ФКТ");
}

// 3-if
const isThird =
  selectedValues.includes('Мужской') &&
  number >= 45 && number <= 74 &&
  selectedValues.includes('Ранее леченные') &&
  selectedValues.includes('ВК+');

if (isThird) {
  console.log("3-guruh: erkak, 45-74, davolangan, ВК+");
}

// 4-if
const isFourth =
  selectedValues.includes('Женский') &&
  number >= 18 && number <= 44 &&
  fourthGroup.some(item => selectedValues.includes(item));

if (isFourth) {
  console.log("4-guruh: ayol, 18-44, yengil shakllar");
}


    } else {
      setActiveStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep(prev => prev - 1);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
     // Form ma'lumotlarini yangilash
     setFormData((prevState) => {
      const newFormData = { ...prevState, [name]: value };

      // selectedValues-ni yangilash
      setSelectedValues((prevSelectedValues) => {
        // Eski qiymatni olib tashlash
        const updatedList = prevSelectedValues.filter((item) => item !== prevState[name]);

        // Yangi qiymatni qo'shish
        updatedList.push(value);

        return updatedList; // Yangilangan listni qaytarish
      });

      return newFormData;
    });
    let addedScore = 0

    if (name === "tuberculosisType"){

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

  // Formani yuborish
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Tanlangan qiymatlar:', selectedValues);
  };

  const handleClick = (e) => {
    handleNext();  // orqaga qaytish
    handleSubmit(e);  // forma yuborish
  };

  return (
    <div
  style={{
    backgroundImage: "url(/assets/fon.jpg)",
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    minHeight: '100vh', // butun ekran balandligi
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
          <Button variant="contained" color="primary" onClick={handleClick}>{activeStep === steps.length - 1 ? 'Отправить' : 'Далее'}</Button>
        </Box>
      </Box>
    </Container>
    </div>
  );
}

export default App;
