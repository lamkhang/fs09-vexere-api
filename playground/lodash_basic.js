const _ = require("lodash")

const user1 = {
  name: "Nguyen Van A",
  age: 30,
  education: {
    university: "DH BK"
  },
  jobs: [
    {
      title: "teacher",
      type: "fullname"
    },
    {
      title: "dev",
      type: "parttime"
    },
  ]
}

const user2 = {
  name: "Nguyen Van A",
  age: 20,
  education: {
    university: "DH BK"
  },
}
const users = [ user1, user2 ]; 
// users.forEach(user => {
//   console.log(_.get(user, "jobs[0].title", "unemployment"))
// })

// _.set

const url = "https://cyberosft.edu.vn/course/1/chapter/2";


// const parseUrl = url.split("/");
// const courseIndex = parseUrl.indexOf("course");
// courseId = parseUrl[courseIndex + 1];
// console.log(courseId);

getObjectId = (type) => {
  return _.chain(url)
  .split("/")
  .indexOf(type)
  .thru(value => value + 1)
  .thru(value => {
    return _.chain(url)
            .split("/")
            .get(value)
            .value()
  })
  .value()
}
console.log(getObjectId("course"))

