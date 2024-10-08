import React, { useState, useRef } from 'react';
import ImgUpload from './이미지 업로드.png';
import Calendar from 'react-calendar';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import TimePicker from 'react-time-picker';
import 'react-calendar/dist/Calendar.css';
import 'react-time-picker/dist/TimePicker.css';
import { format } from 'date-fns';
import moment from 'moment';
import axios from 'axios';

/*컨테이너 및 구역 나눔*/
const FullContainner = styled.div`
  margin: 0 auto;
  justify-content: center;
  width: 900px;
  max-width: 1200px;
  box-sizing: border-box;
`;

const PlanContainer = styled.div`
  display: flex;
`;

const ContentContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const TimeContainer = styled.div``;

/* PlanTop 및 PlanBottom */
const PlanTop = styled.div`
  display: flex;
  div {
    font-size: 18px;
  }
`;
const PlanBottom = styled.div`
  display: flex;
  div {
    font-size: 18px;
  }
`;
/*이미지, 텍스트*/
const Img = styled.img`
  width: 500px;
  height: 300px;
  object-fit: contain;
  cursor: pointer;
`;
const Text = styled.div`
  > div {
    margin: 10px 0;
  }
  > input {
    width: 494px;
    height: 25px;
    font-size: 16px;
  }
  > textarea {
    font-size: 16px;
    cols: 10;
  }
`;
/*캘린더*/
const CalendarContainer = styled.div`
  margin-bottom: 20px;
`;
const StyledCalendar = styled(Calendar)`
  border: none;
  border-radius: 10px;
  background-color: #f9f9f9;
  padding: 10px;

  .react-calendar__month-view__weekdays {
    display: none;
  }

  .react-calendar__month-view__weekdays__weekday {
    display: none;
  }

  .react-calendar__tile--now {
    border: 2px solid #4caf50;
  }

  .react-calendar__tile--active {
    background: #45a049;
    color: white;
  }
`;
const DateDisplay = styled.div`
  margin: 20px 0px;
  display: flex;
  align-items: center;
`;
const DateText = styled.p`
  font-size: 15px;
  padding: 5px 15px;
  background-color: #f0f0f0;
  border-radius: 10px;
`;
const Separator = styled.div`
  font-size: 15px;
  margin: 0 10px;
`;
/*시간*/
const TimeDisplay = styled.div`
  display: flex;
  align-items: center;
  margin: 15px 0px;
`;
const StyledTimePicker = styled(TimePicker)`
  .react-time-picker__wrapper {
    background-color: #f0f0f0;
    border-radius: 10px;
    border: none;
    padding: 2px 2px;
    font-size: 15px;
  }
`;
const ToggleLabel = styled.label`
  display: flex;
  cursor: pointer;
`;

const ToggleSwitch = styled.input`
  appearance: none;
  width: 34px;
  height: 20px;
  background: #ccc;
  border-radius: 20px;
  position: relative;
  outline: none;
  cursor: pointer;

  &:checked {
    background: #4caf50;
  }

  &:checked::before {
    transform: translateX(14px);
  }

  &::before {
    content: '';
    position: absolute;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: white;
    top: 2px;
    left: 2px;
    transition: transform 0.2s ease;
  }
`;
/*페이지 이동 버튼*/
const NextButton = styled.button`
  width: 100%; /* 버튼 너비 확장 */
  height: 50px; /* 버튼 높이 조정 */
  text-align: center;
  font-size: 16px;
  margin-top: 20px;
  border-radius: 30px;
  border: 1px solid #4caf50;
  background-color: #4caf50;
  color: white;
  cursor: pointer;
  outline: none;
  transition: background-color 0.3s ease, border-color 0.3s ease; /* 배경색과 테두리 색상 변화에 애니메이션 추가 */

  &:hover {
    background-color: #45a049;
    border-color: #45a049;
  }
`;
/*시간, 기간 위치*/
const Time = styled.div``;

function MakePlanRoom1() {
  const [image, setImage] = useState(ImgUpload);
  const [title, setTitle] = useState(''); // 여행 제목 상태 관리
  const [explain, setExplain] = useState(''); // 여행 설명 상태 관리
  const [dateRange, setDateRange] = useState([new Date(), new Date()]);
  const [startDate, endDate] = dateRange;
  const [startTime, setStartTime] = useState('00:00');
  const [endTime, setEndTime] = useState('00:00');
  const [showTime, setShowTime] = useState(false);
  const [imageFile, setImageFile] = useState(null); 
  const fileInputRef = useRef(null);
  const region='지역'; // MakePlanRoom2 이전에 미리 초기값 설정 (formData 넘기려고..)
  const status=1;

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImageFile(file);
      setImage(URL.createObjectURL(file));
    }
  };

  const onDateChange = (range) => {
    setDateRange(range);
  };

  const handleToggleChange = () => {
    setShowTime(!showTime);
  };

  const navigate = useNavigate();

  const handleLink = async (travelId) => {
    const [startDate, endDate] = dateRange;
    const token = localStorage.getItem('token'); 
    console.log('JWT Token:', JSON.stringify(token));
    // FormData 생성
    const formData = new FormData();
    formData.append('title', title); 
    formData.append('start_date', format(startDate, 'yyyy-MM-dd'));
    formData.append('end_date', format(endDate, 'yyyy-MM-dd'));
    formData.append('explain', explain); 
    formData.append('start_time', showTime ? startTime : '00:00');
    formData.append('end_time', showTime ? endTime : '00:00');
    formData.append('region', region); // 추가된 지역
    formData.append('status', status); 

    if (image) {
      formData.append('travel_image', imageFile); // 선택된 파일 추가

    try {
      const response = await axios.post('http://43.200.238.249:5000/travel-plans/makeRoom', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      const travelId = response.data.travel_id;
      console.log('응답 데이터(FormData):', response.data);
      console.log('여행 계획방 ID:', travelId);

      navigate('/MakePlanroom2', { state: { travelId } });

    } catch (error) {
      console.error('에러 발생:', error.response ? error.response.data : error.message);
      if (error.response) {
        console.error('서버 응답 오류:', error.response.data);
    }
    }
  }
  };


  return (
    <FullContainner>
      <h1>여행 계획방 만들기 (1/2)</h1>
      <PlanContainer>
        <ContentContainer>
          <PlanTop>
            <div>
              <div>대표 이미지</div>
              <br />
              <Img
                src={image}
                alt="image_upload"
                id="image_upload"
                onClick={() => {
                  if (fileInputRef.current) {
                    fileInputRef.current.click();
                  } else {
                    console.warn('File input element is null/undefined');
                  }
                }}
              />
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleImageUpload}
              />
            </div>
          </PlanTop>
          <PlanBottom>
            <Text>
              <div>여행 제목</div>
              <input type="text" placeholder="여행 제목을 입력하세요." onChange={(e)=>{setTitle(e.target.value)}}/>
              <div>여행 설명</div>
              <textarea
                cols="55"
                rows="10"
                placeholder="여행 설명을 입력하세요."
                onChange={(e)=>{setExplain(e.target.value)}}
              />
            </Text>
          </PlanBottom>
        </ContentContainer>
        <TimeContainer>
          <div>여행 기간</div>
          <DateDisplay>
            <DateText>{format(startDate, 'yyyy/MM/dd')}</DateText>
            <Separator>~</Separator>
            <DateText>{format(endDate, 'yyyy/MM/dd')}</DateText>
          </DateDisplay>
          <CalendarContainer>
            <StyledCalendar
              selectRange={true}
              onChange={onDateChange}
              value={dateRange}
              calendarType="gregory"
              showNeighboringMonth={false}
              next2Label={null}
              prev2Label={null}
              minDetail="year"
              formatDay={(locale, date) => moment(date).format('D')} // 일 제거 숫자만 보이게
              formatYear={(locale, date) => moment(date).format('YYYY')} // 네비게이션 눌렀을때 숫자 년도만 보이게
              formatMonthYear={(locale, date) =>
                moment(date).format('YYYY. MM')
              }
            />
          </CalendarContainer>
          <Time>
            <ToggleLabel>
              <span>시간 설정 표시</span>
              <ToggleSwitch
                type="checkbox"
                checked={showTime}
                onChange={handleToggleChange}
              />
            </ToggleLabel>
            {showTime && (
              <TimeDisplay>
                <StyledTimePicker
                  onChange={setStartTime}
                  value={startTime}
                  format="HH:mm"
                  clearIcon={null}
                />
                <Separator>~</Separator>
                <StyledTimePicker
                  onChange={setEndTime}
                  value={endTime}
                  format="HH:mm"
                  clearIcon={null}
                />
              </TimeDisplay>
            )}
          </Time>
        </TimeContainer>
      </PlanContainer>
      <NextButton onClick={handleLink}>다음으로</NextButton>
    </FullContainner>
  );
}

export default MakePlanRoom1;
