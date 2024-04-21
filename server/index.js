const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');
const cors = require('cors');
const app = express();

app.use(bodyParser.json());
app.use(cors());

const port = 8000;

let conn =null;

const initMySQL = async () =>{
  conn = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'webdb',
    port: 8820
    })
}
 
const validateData = (userData) => {
  let errors = [];

if(!userData.OriginPlace){
    errors.push('กรุณาเลือกสถานที่ต้นทาง')
}
if(!userData.DestinationPlace){
    errors.push('กรุณาเลือกสถานที่ปลายทาง')
}
if(!userData.Status){
    errors.push('กรุณาเลือกสถานะการติดตามการส่ง')
}
if(!userData.WarehouseStorange){
    errors.push('กรุณาเลือกสถานที่เก็บสินค้า')
}
if(!userData.TimeOriginPlace){
    errors.push('กรุณาเลือกวันที่และเวลาต้นทาง')
}
if(!userData.TimeWarehouse){
    errors.push('กรุณาเลือกวันที่และเวลาเข้าคลังสินค้า')
}
if(!userData.Zone){
  errors.push('กรุณาเลือกโซน')
}
if(!userData.TimeDestinationPlace){
    errors.push('กรุณาเลือกวันที่และเวลาปลายทาง')
}
if(!userData.Efficiency){
    errors.push('กรุณาเลือกประสิทธิภาพการส่งสินค้า')
}
if(!userData.Problem){
    errors.push('กรุณากรอกปัญหาที่พบ')
}

  return errors
}


 // path = GET /users สำหรับ get users ทั้งหมดที่บันทึกเข้าไปออกมา
 app.get('/Brownie_Logistic', async(req, res) => {
  const result = await conn.query('SELECT * FROM Brownie_Logistic')
  res.json(result[0]);
})

// path = POST /users สำหรับการสร้าง users ใหม่บันทึกเข้าไป
// path = POST /users สำหรับการสร้าง users ใหม่บันทึกเข้าไป
app.post('/Brownie_Logistic', async (req, res) => {
  try {
let user = req.body;
  const errors = validateData(user)
    if(errors.length > 0){
      throw {message: 'กรอกข้อมูลไม่ครบ', 
      errors:errors}
    }
const results = await conn.query('INSERT INTO Brownie_Logistic SET ? ', user)
  res.json({
    message: 'insert Brownie_Logistic successfully',
    data: results[0] })
  }catch(error){
    const errorMessage = error.message || 'something went wrong'
    const errors = error.errors || []
    console.log('errorMessage:',error.message);
    res.status(500).json({
    message:errorMessage,
    errors: errors
  })
}
})

// path = GET /users/:id สำหรับการดึง users รายคนออกมา
app.get('/Brownie_Logistic/:OrderID', async (req, res) => {
  try {
    let OrderID = req.params.id
    const results = await conn.query('SELECT * FROM Brownie_Logistic WHERE OrderID = ?', OrderID)
   
    if(results[0].length == 0){
      throw {statusCode: 404, message: 'Brownie_Logistic not found'}
    } 
    res.json(results[0][0])
  } catch (error) {
    console.log('error message:', error.message)
    let statusCode = error.statusCode || 500
    res.status(statusCode).json({
      message: 'something went wrong',
      errorMessage: error.message
    })
  }
})

//path = PUT /users/:id สำหรับการแก้ไข users รายคน (ตาม id ที่บันทึกเข้าไป)
app.put('/Brownie_Logistic/:OrderID', async(req, res) => {

  try {
      let OrderID = req.params.OrderID;
      let updateUser = req.body;
      const results = await conn.query(
        'UPDATE Brownie_Logistic SET ? WHERE OrderID = ?'
      , [updateUser,OrderID]
      )
        res.json({
        message: 'update Brownie_Logistic successfully',
        data: results[0] })
      }catch(error){
        console.log('errorMessage',error.message);
        res.status(500).json({
        message:'something went wrong',
      })
    }
})

// path = DELETE /users/:id สำหรับการลบ users รายคน (ตาม id ที่บันทึกเข้าไป)
app.delete('/Brownie_Logistic/:OrderID', async(req, res) => {
  try {
  let OrderID = req.params.id;
  const results = await conn.query(
    'DELETE FROM Brownie_Logistic WHERE OrderID = ?',parseInt(OrderID)) 
    res.json({
    message: 'delete Brownie_Logistic successfully',
    data: results[0] })
  }catch(error){
    console.log('errorMessage',error.message);
    res.status(500).json({
    message:'something went wrong',
  })
    }
})

app.listen(port, async(req, res) => {
  await initMySQL()
  console.log('http server running on', + port);
})