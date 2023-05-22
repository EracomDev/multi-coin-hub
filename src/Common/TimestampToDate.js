export default function TimestampToDate(time , platform=0){
        if(platform==0){
                var date = new Date(time * 1000);
                date = date.toLocaleString(undefined, { timeZone: 'Asia/Kolkata' });
                return String(date);
        }else{
                var date = new Date(time * 1000);
                var currentDate = new Date();
                date = date.toLocaleString(undefined, { timeZone: 'Asia/Kolkata' });
                return String(date);
        }
}