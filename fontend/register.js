const BASE_URL = 'http://localhost:8000'

let mode = 'CREATE'
let selectedId = '' //ตัวแปรแบบ Golbal ใช้ได้ทุกที่

window.onload = async () => {
  const urlParams = new URLSearchParams(window.location.search)
  const OrderID = urlParams.get('OrderID')
  console.log('OrderID', OrderID)
  if (OrderID) {
    mode = 'EDIT'
    selectedId = OrderID

    try {
      const response = await axios.get(`${BASE_URL}/Brownie_Logistic/${OrderID}`)
      const user = response.data

      let OriginPlaceDOM = document.querySelector('input[name=OriginPlace]')
      let DestinationPlaceDOM = document.querySelector('input[name=DestinationPlace]')
      let ProblemDOM = document.querySelector('textarea[name=Problem]')
      let TimeOriginPlaceDOM = document.querySelector('datetime-local[name=TimeOriginPlace]')
      let TimeWarehouseDOM = document.querySelector('datetime-local[name=TimeWarehouse]')
      let TimeDestinationPlaceDOM = document.querySelector('datetime-local[name=TimeDestinationPlace]')
      let EfficiencyDOM = document.querySelector('input[name=Efficiency]')

      OriginPlaceDOM.value = user.OriginPlace
      DestinationPlaceDOM.value = user.DestinationPlace
      TimeOriginPlaceDOM.value = user.Problem
      TimeWarehouseDOM.value = user.TimeOriginPlace
      TimeDestinationPlaceDOM.value = user.TimeDestinationPlace
      ProblemDOM.value = user.Problem
      EfficiencyDOM.value = user.Efficiency

      let StatusDOMs = document.querySelectorAll('input[name=Status]')
      let WarehouseStorangeDOMs = document.querySelectorAll('input[name=WarehouseStorange]')
      let ZoneDOMs = document.querySelectorAll('input[name=Zone]')

      for (let i = 0; i < StatusDOMs.length; i++) {
        if (StatusDOMs[i].value == user.Status) {
          StatusDOMs[i].checked = true
        }
      }

      for (let i = 0; i < WarehouseStorangeDOMs.length; i++) {
        if (WarehouseStorangeDOMs[i].value == user.WarehouseStorange) {
          WarehouseStorangeDOMs[i].checked = true
        }
      }

      for (let i = 0; i < ZoneDOMs.length; i++) {
        if (ZoneDOMs[i].value == user.Zone) {
          ZoneDOMs[i].checked = true
        } 
      }

    } catch (error) {
      console.log('error', error)
    }
  }
}
  const validateData = (userData) => {
  let errors = []
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

  const submitData = async () => {
      let OriginPlaceDOM = document.querySelector('input[name=OriginPlace]')
      let DestinationPlaceDOM = document.querySelector('input[name=DestinationPlace]')
      let ProblemDOM = document.querySelector('textarea[name=Problem]')
      let TimeOriginPlaceDOM = document.querySelector('input[name=TimeOriginPlace]')
      let TimeWarehouseDOM = document.querySelector('Time[name=TimeWarehouse]')
      let TimeDestinationPlaceDOM = document.querySelector('input[name=TimeDestinationPlace]')
      let EfficiencyDOM = document.querySelector('input[name=Efficiency]:checked')||{}
      let StatusDOMs = document.querySelector('input[name=Status]:checked')||{}
      let WarehouseStorangeDOMs = document.querySelector('input[name=WarehouseStorange]:checked')||{}
      let ZoneDOMs = document.querySelector('input[name=Zone]:checked')||{}
      
      let messageDOM = document.getElementById('message')

    try {
      
      console.log('test')
      let userData = {
        OriginPlace: OriginPlaceDOM.value,
        DestinationPlace: DestinationPlaceDOM.value,
        Problem: ProblemDOM.value,
        TimeOriginPlace: TimeOriginPlaceDOM.value,
        TimeWarehouse: TimeWarehouseDOM.value,
        TimeWarehouse:TimeWarehouseDOM.value,
        TimeDestinationPlace:TimeDestinationPlaceDOM.value,
        Efficiency:EfficiencyDOM.value,
        Status:StatusDOMs.value,
        WarehouseStorange:WarehouseStorangeDOMs.value,
        Zone:ZoneDOMs.value
      }
      console.log('submit data', userData)

      const errors = validateData(userData)

      if (errors.length > 0) {
        throw {
          message: 'กรอกข้อมูลไม่ครบ!',
          errors: errors
        }
      }

      let message = 'บันทึกข้อมูลสำเร็จ!'

      if(mode == 'CREATE'){
        const response = await axios.post(`${BASE_URL}/Brownie_Logistic`, userData)
        console.log('response', response.data)
      } else {
        const response = await axios.put(`${BASE_URL}/Brownie_Logistic/${selectedId}`, userData)
        message = 'แก้ไขข้อมูลสำเร็จ!'
        console.log('response', response.data)
      }
      messageDOM.innerText = message
      messageDOM.className = 'message success'

    } catch (error) {
      console.log('error message', error.message)
      console.log('error', error.erros)
      if (error.response) {
        console.log(error.response)
        error.message = error.response.data.message
        error.errors = error.response.data.errors
      }

      let htmlData = '<div>'
      htmlData += `<div>${error.message}</div>`
      htmlData += '<ul>'
      for (let i = 0; i < error.errors.length; i++) {
        htmlData += `<li>${error.errors[i]}</li>`
      }
      htmlData += '</ul>'
      htmlData += '<div>'


      messageDOM.innerHTML = htmlData
      messageDOM.className = 'message danger'
    }
  }