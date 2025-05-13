import React, { useState, useEffect } from 'react';
import {
  Stepper, Step, StepLabel, Button, TextField, Select, MenuItem,
  Container, Typography, FormControl, InputLabel, Box, RadioGroup, FormControlLabel, Radio
} from '@mui/material';




function App() {

  const [categoryRisk, setCategoryRisk] = useState(null);
  const [statsionar, setStatsionar] = useState(false);

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
    baktyerioVideleniya: '',
    oslojeniya: '',
    questions: [],
  });
  const [score, setScore] = useState(0);

  const steps = ['Шаг 1: Персональная информация', 'Шаг 2: Медицинская информация', 'Шаг 3: Опросник Мориски'];


  const [factorResult, setFactorResult] = useState(1);
  const [logresult, setLogResult] = useState(1);

   // Gender koeffitsiyentlari
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

  // Category koeffitsiyentlari
  const CATEGORY_FACTORS = {
    'Впервые выявленные': 0.80,
    'Ранее леченные': 1.34,
  };

  const VIDELENIYA_FACTORS = {
    'ВК+': 1.36,
    'ВК-': 0.73,
  };

  // Клинические формы koeffitsiyentlari
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
  };
  
  // Social Status koeffitsiyentlari
  const SOCIAL_FACTORS = {
    'Бомж': 2.00,
    'Из заключения': 4.00,
    'Злоупотребление алкоголем': 4.85,
    'Употребление наркотиков': 7.00,
  };

  // Comorbidity koeffitsiyentlari
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
  };

  const OSLOJENIYA_FACTORS = {
    "Жизнеугрожающие (Кровохаркание, кровотечение, спонтанный пневмоторакс)": 0,
  }
  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      let totalScore = score; // `score` ni to'plagan qiymatga boshlang'ich qiymat qilib oling
      formData.questions.forEach(answer => {
        if (answer === 'yes') {
          totalScore += 1;
        }
        if (answer === "Редко") {
          totalScore += 0.25;
        }
        if (answer === "Иногда") {
          totalScore += 0.5;
        }
        if (answer === "Очень часто") {
          totalScore += 1;
        }
        if (answer === "Часто") {
          totalScore += 0.75;
        }
      });
  
      setScore(totalScore); // `setScore` bilan yangilash
      // if (condition) {
      //   alert(`Форма отправлена. Общий балл риска: ${totalScore.toFixed(2)}`);
      // }
      console.log(totalScore);
    } else {
      setActiveStep(prev => prev + 1);
    }
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
  
    // To'g'ri qiymatlarni olish uchun updatedFormData dan foydalaning
    const genderFactor = GENDER_FACTORS[updatedFormData.gender] || 1;
    const ageFactor = AGE_FACTORS[updatedFormData.age] || 1;
    const categoryFactor = CATEGORY_FACTORS[updatedFormData.category] || 1;
    const clinicalFactor = CLINICAL_FACTORS[updatedFormData.tuberculosisType] || 1;
    const socialFactor = SOCIAL_FACTORS[updatedFormData.socialStatus] || 1;
    const comorbidityFactor = COMORBIDITY_FACTORS[updatedFormData.chronicDiseases] || 1;
    const videleniyaFactor = VIDELENIYA_FACTORS[updatedFormData.baktyerioVideleniya] || 1;
  
    // Totalni hisoblash
    const total = genderFactor * ageFactor * categoryFactor * clinicalFactor * socialFactor * comorbidityFactor * videleniyaFactor;
    console.log("Raw Total before log:", total);


    setFactorResult(total);
    setLogResult(Math.log10(total).toFixed(4));
  
    // updatedFormData-dan to'g'ri qiymatlarni ko'rsatish
    console.log("Gender:", updatedFormData.gender, "Factor:", GENDER_FACTORS[updatedFormData.gender]);
    console.log("Age:", updatedFormData.age, "Factor:", AGE_FACTORS[updatedFormData.age]);
    console.log("Category:", updatedFormData.category, "Factor:", CATEGORY_FACTORS[updatedFormData.category]);
    console.log("Clinical:", updatedFormData.tuberculosisType, "Factor:", CLINICAL_FACTORS[updatedFormData.tuberculosisType]);
    console.log("Social:", updatedFormData.socialStatus, "Factor:", SOCIAL_FACTORS[updatedFormData.socialStatus]);
    console.log("Videleniya:", updatedFormData.baktyerioVideleniya, "Factor:", VIDELENIYA_FACTORS[updatedFormData.baktyerioVideleniya]);
    console.log("Comorbidity:", updatedFormData.chronicDiseases, "Factor:", COMORBIDITY_FACTORS[updatedFormData.chronicDiseases]);
  
    // Qo'shimcha shart
    if (updatedFormData.oslojeniya === "Жизнеугрожающие (Кровохаркание, кровотечение, спонтанный пневмоторакс)" || updatedFormData.comorbidity === "Беременность" || updatedFormData.comorbidity === "Психические заболевания" || updatedFormData.clinicalForm === "Генерализованный туберкулез") {
      setStatsionar(true);
    }

  console.log(score);

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
    const updated = [...formData.questions];
    updated[index] = value;
    setFormData({ ...formData, questions: updated });
  };

  // Formani yuborish
  const handleSubmit = (e) => {
    e.preventDefault();

    if (statsionar) {
      alert(`Стационар`);
    }else{
         //1.Низкий риск+ высокая приверженность
if (logresult >= -2.3012 && logresult <= -0.2678 && score ===0) {
  alert(`Амбулаторная модель`);
  console.log("Амбулаторная модель");
  // Qo'shimcha harakatlar yoki xabarlar 
}

    //2.Низкий риск+ высокая приверженность
    if (logresult >= -2.3012 && logresult <= -0.2678 && (score === 1 || score === 2) ) {
      alert(`Амбулаторная модель, при возможности полного контроля, ВКЛ`);
      console.log("Амбулаторная модель, при возможности полного контроля, ВКЛ");
      // Qo'shimcha harakatlar yoki xabarlar
      
    }
    
        //3.Низкий риск+ высокая приверженность
if (logresult >= -2.3012 && logresult <= -0.2678 && score >= 3) {
  alert(`Амбулаторная модель, при условии повышения приверженности,  ВКЛ`);
  console.log("Амбулаторная модель, при условии повышения приверженности,  ВКЛ");
  // Qo'shimcha harakatlar yoki xabarlar
  
}

    //4.Низкий риск+ высокая приверженность
    if (logresult > -2.2678 && logresult <= 1.7656 && score === 0) {
      alert(`Амбулаторная модель`);
      console.log("Амбулаторная модель");
      // Qo'shimcha harakatlar yoki xabarlar
      
    }

        //5.Низкий риск+ высокая приверженность
if (logresult > -2.2678 && logresult <= 1.7656 && (score === 1 || score === 2)) {
  alert(`Амбулаторная модель (Мобильная группа на транспорте) `);
  console.log("Амбулаторная модель (Мобильная группа на транспорте) ");
  // Qo'shimcha harakatlar yoki xabarlar
  
}

    //6.Низкий риск+ высокая приверженность
    if (logresult > -2.2678 && logresult <= 1.7656 && score >= 3) {
      alert(`Возможно амбулаторная модель (Мобильная группа на транспорте)`);
      console.log("Возможно амбулаторная модель (Мобильная группа на транспорте)");
      // Qo'shimcha harakatlar yoki xabarlar
      
    }

        //7.Низкий риск+ высокая приверженность
if (logresult > 1.7656 && logresult <= 3.7990 && score ===0) {
  alert(`Стационар`);
  console.log("Стационар");
  // Qo'shimcha harakatlar yoki xabarlar
  
}

    //8.Низкий риск+ высокая приверженность
    if (logresult > 1.7656 && logresult <= 3.7990 && (score === 1 || score === 2)) {
      alert(`Стационар`);
      console.log("Стационар");
      // Qo'shimcha harakatlar yoki xabarlar
      
    }

        //9.Низкий риск+ высокая приверженность
if (logresult > 1.7656 && logresult <= 3.7990 && score >= 3) {
  alert(`Стационар`);
  console.log("Стационар");
  // Qo'shimcha harakatlar yoki xabarlar
  
}

    //10.Низкий риск+ высокая приверженность
    if (logresult > 3.7990 && logresult <= 5.8323 && score ===0) {
      alert(`Стационар`);
      console.log("Стационар");
      // Qo'shimcha harakatlar yoki xabarlar
      
    }

        //11.Низкий риск+ высокая приверженность
if (logresult > 3.7990 && logresult <= 5.8323 && (score === 1 || score === 2)) {
  alert(`Стационар`);
  console.log("Стационар");
  // Qo'shimcha harakatlar yoki xabarlar
  
}

    //12.Низкий риск+ высокая приверженность
    if (logresult > 3.7990 && logresult <= 5.8323 && score >= 3) {
      alert(`Стационар`);
      console.log("Стационар");
      // Qo'shimcha harakatlar yoki xabarlar
      
    }
    }

    
    
    console.log('Tanlangan qiymatlar:', logresult);
    // Default holatga qaytarish
    setActiveStep(0); // Boshlang'ich bosqichga qaytarish
    setFormData({
      gender: '',
      age: '',
      category: '',
      clinicalForm: '',
      socialStatus: '',
      chronicDiseases: '',
      videleniyaFactor: '',
      oslojeniya: '',
      questions: [],
    }); // Form ma'lumotlarini default holatga qaytarish
    setScore(0); // Ballarni 0 ga qaytarish
  };

  const handleClick = (e) => {
    handleNext();  // orqaga qaytish
    if (activeStep === steps.length - 1) {
      handleSubmit(e);  // forma yuborish
    }
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
                <InputLabel>Бактерио виделения</InputLabel>
                <Select name="baktyerioVideleniya" value={formData.baktyerioVideleniya} onChange={handleChange} label="Бактерио виделения">
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
                    'Генерализованный туберкулез': '',
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

              <FormControl fullWidth margin="normal">
                <InputLabel>Осложнения</InputLabel>
                <Select name="oslojeniya" value={formData.oslojeniya} onChange={handleChange} label="Осложнения">
                  <MenuItem value="Жизнеугрожающие (Кровохаркание, кровотечение, спонтанный пневмоторакс)">Жизнеугрожающие (Кровохаркание, кровотечение, спонтанный пневмоторакс)</MenuItem>
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
