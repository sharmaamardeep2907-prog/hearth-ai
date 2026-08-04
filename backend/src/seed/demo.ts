import mongoose from "mongoose"; import { v4 as uuidv4 } from "uuid"; import { User } from "../models/user.model"; import { Provider } from "../models/provider.model"; import { Booking } from "../models/booking.model"; import { Review } from "../models/review.model"; import { Wallet } from "../models/wallet.model"; import { ChatRoom } from "../models/chat.model"; import { Notification } from "../models/notification.model"; import { UserRole, AuthProvider, BookingStatus, PaymentStatus, BookingType, NotificationChannel, WalletTransactionType } from "../types"; import { config } from "../config";
/* HEARTH AI DEMO SEED — Populates database with realistic showcase data */
const CITIES=[{city:"Mumbai",state:"Maharashtra",lat:19.076,lng:72.8777},{city:"Delhi",state:"Delhi",lat:28.614,lng:77.209},{city:"Bangalore",state:"Karnataka",lat:12.972,lng:77.595},{city:"Hyderabad",state:"Telangana",lat:17.385,lng:78.487},{city:"Chennai",state:"Tamil Nadu",lat:13.083,lng:80.271},{city:"Pune",state:"Maharashtra",lat:18.520,lng:73.857}];
const CATS=["Electrician","Plumber","AC Repair","Carpenter","Painter","Cleaner","Salon & Spa","Tutor","Photographer","Mechanic","Interior Designer","Mobile Repair","Pest Control","Movers & Packers","Laptop Repair","Doctor","Lawyer","Consultant"];
const SL:Record<string,string>={Electrician:"electrician",Plumber:"plumber","AC Repair":"ac-repair",Carpenter:"carpenter",Painter:"painter",Cleaner:"cleaning","Salon & Spa":"salon-spa",Tutor:"tutor",Photographer:"photographer",Mechanic:"mechanic","Interior Designer":"interior-designer","Mobile Repair":"mobile-repair","Pest Control":"pest-control","Movers & Packers":"movers-packers","Laptop Repair":"laptop-repair",Doctor:"doctors",Lawyer:"lawyers",Consultant:"consultants"};
const BN:Record<string,string[]>={Electrician:["PowerPro Electricals","BrightSpark Solutions","VoltGuard Services"],Plumber:["AquaFix Plumbing","FlowMaster Pipes","HydroTech Solutions"],"AC Repair":["CoolZone AC Service","FrostFix Cooling","ChillTech Repairs"],Carpenter:["WoodCraft Studios","FineEdge Carpentry","ArtisanWood India"],Painter:["ColorVista Painting","WallCraft Pro","PrimeCoat Solutions"],Cleaner:["SparklePro Cleaning","DeepClean India","ShineOn Services"],"Salon & Spa":["GlamourNest Salon","Radiance Spa","EliteGlow Studio"],Tutor:["BrainBridge Academy","EduVista Tutoring","MindSpark Education"],Photographer:["LensCraft Photography","PixelPerfect Studios","FrameStory India"],Mechanic:["AutoRevive Garage","TorqueMasters Motors","DriveFit Services"],"Interior Designer":["SpaceCraft Interiors","DecorVista Design","LuxeNest Studios"],"Mobile Repair":["PhoneMedic Repairs","ScreenFix Pro","SmartRepair Hub"],"Pest Control":["PestFree India","BugShield Services","SafeNest Pest Control"],"Movers & Packers":["SafeShift Movers","MoveMate Logistics","TransitPro Packers"],"Laptop Repair":["TechFix Laptops","CircuitCare Repairs","ByteSaver Solutions"],Doctor:["HealthFirst Clinic","MediCare Plus","WellnessHub India"],Lawyer:["LexGuard Legal","JusticePath Advocates","RightsDefend Legal"],Consultant:["StrategyEdge Consulting","BizWise Advisors","GrowthPulse India"]};
const PF=["Rajesh","Amit","Suresh","Deepak","Vikram","Karan","Arjun","Ravi","Priya","Anita","Neha","Divya","Ananya","Meera","Rohit","Vijay","Sanjay","Prakash"];
const PL=["Kumar","Singh","Sharma","Verma","Patel","Mehta","Gupta","Reddy","Rao","Joshi","Desai","Nair","Chopra","Kapoor"];
const CUST=[{first:"Amardeep",last:"Singh",email:"amar2907deep@gmail.com"},{first:"Rahul",last:"Mehta",email:"rahul@example.com"},{first:"Priya",last:"Sharma",email:"priya@example.com"},{first:"Ananya",last:"Patel",email:"ananya@example.com"},{first:"Aditya",last:"Nair",email:"aditya@example.com"},{first:"Sneha",last:"Joshi",email:"sneha@example.com"},{first:"Vivek",last:"Reddy",email:"vivek@example.com"},{first:"Kavya",last:"Iyer",email:"kavya@example.com"}];
const CS:Record<string,{name:string;price:number;pt:"fixed"|"hourly"|"estimate"}[]>={Electrician:[{name:"Switchboard Repair",price:299,pt:"fixed"},{name:"Wiring",price:499,pt:"estimate"},{name:"Inverter Install",price:899,pt:"fixed"},{name:"Fan Repair",price:249,pt:"fixed"}],Plumber:[{name:"Tap Repair",price:199,pt:"fixed"},{name:"Pipe Leak",price:399,pt:"estimate"},{name:"Water Heater",price:699,pt:"fixed"},{name:"Drain Clean",price:349,pt:"fixed"}],"AC Repair":[{name:"AC Service",price:499,pt:"fixed"},{name:"Gas Refill",price:1499,pt:"fixed"},{name:"AC Install",price:1999,pt:"estimate"}],Carpenter:[{name:"Furniture Assembly",price:499,pt:"fixed"},{name:"Custom Shelves",price:1499,pt:"estimate"},{name:"Door Repair",price:399,pt:"fixed"}],Painter:[{name:"Wall Painting",price:2499,pt:"estimate"},{name:"Texture Work",price:4999,pt:"estimate"}],Cleaner:[{name:"Deep Clean",price:799,pt:"fixed"},{name:"Sofa Clean",price:499,pt:"fixed"}],"Salon & Spa":[{name:"Haircut & Styling",price:399,pt:"fixed"},{name:"Facial",price:599,pt:"fixed"},{name:"Spa",price:999,pt:"fixed"},{name:"Bridal Makeup",price:4999,pt:"fixed"}],Tutor:[{name:"Math Tuition",price:499,pt:"hourly"},{name:"Coding",price:799,pt:"hourly"}],Photographer:[{name:"Event Shoot",price:2999,pt:"fixed"},{name:"Portrait",price:1499,pt:"fixed"}],Mechanic:[{name:"Bike Service",price:399,pt:"fixed"},{name:"Car AC Repair",price:999,pt:"estimate"}],"Interior Designer":[{name:"Room Design",price:1499,pt:"fixed"},{name:"Modular Kitchen",price:9999,pt:"estimate"}],"Mobile Repair":[{name:"Screen Fix",price:1499,pt:"estimate"},{name:"Battery",price:799,pt:"fixed"}],"Pest Control":[{name:"Termite",price:1499,pt:"fixed"},{name:"Cockroach",price:799,pt:"fixed"}],"Movers & Packers":[{name:"Home Shift",price:4999,pt:"estimate"},{name:"Office Move",price:14999,pt:"estimate"}],"Laptop Repair":[{name:"Screen",price:2499,pt:"estimate"},{name:"Battery",price:1499,pt:"fixed"}],Doctor:[{name:"Consultation",price:499,pt:"fixed"},{name:"Dermatology",price:799,pt:"fixed"}],Lawyer:[{name:"Legal Consult",price:1499,pt:"fixed"},{name:"Docs",price:2999,pt:"estimate"}],Consultant:[{name:"Strategy",price:2999,pt:"hourly"},{name:"Financial",price:1999,pt:"hourly"}]};
function pk<T>(a:T[]):T{return a[Math.floor(Math.random()*a.length)]}
function ri(a:number,b:number):number{return Math.floor(Math.random()*(b-a+1))+a}
function rf(a:number,b:number):number{return Math.round((Math.random()*(b-a)+a)*10)/10}
function da(n:number):Date{const d=new Date();d.setDate(d.getDate()-n);d.setHours(ri(8,18),ri(0,59),0,0);return d}
function df(n:number):Date{const d=new Date();d.setDate(d.getDate()+n);d.setHours(ri(8,18),pk([0,30]),0,0);return d}
function bid():string{return `HTH-${Date.now().toString(36).toUpperCase()}-${uuidv4().slice(0,4).toUpperCase()}`}

async function seed(){
  try{
    await mongoose.connect(config.mongodb.uri);
    console.log("🌱 Connected to MongoDB");
    console.log("🧹 Cleaning existing data...");
    await Promise.all([User.deleteMany({}),Provider.deleteMany({}),Booking.deleteMany({}),Review.deleteMany({}),Wallet.deleteMany({}),ChatRoom.deleteMany({}),Notification.deleteMany({})]);
    console.log("✅ Cleaned");

    console.log("\n👤 Creating users...");
    const admin=await User.create({email:"admin@hearth.ai",password:"Admin@123456",firstName:"Admin",lastName:"User",role:UserRole.ADMIN,provider:AuthProvider.LOCAL,emailVerified:true});
    console.log(`  Admin: admin@hearth.ai / Admin@123456`);
    const custs:any[]=[];
    for(const c of CUST){const u=await User.create({email:c.email,password:"Customer@123",firstName:c.first,lastName:c.last,phone:`+91${ri(7000000000,9999999999)}`,role:UserRole.CUSTOMER,provider:AuthProvider.LOCAL,emailVerified:true,phoneVerified:Math.random()>0.3,lastLogin:da(ri(0,5)),loginHistory:[{ip:"192.168.1.1",device:"Chrome/Windows",timestamp:da(ri(0,2)),successful:true},{ip:"10.0.0.1",device:"Safari/iPhone",timestamp:da(ri(3,7)),successful:true}]});custs.push(u)}
    console.log(`  ${custs.length} customers (pw: Customer@123)`);

    console.log("\n🔧 Creating providers...");
    const provs:any[]=[];const pu:any[]=[];
    for(const cat of CATS){
      const names=BN[cat]||[cat+" Services"];
      const slug=SL[cat]||cat.toLowerCase().replace(/\s+/g,"-");
      const city=pk(CITIES);
      for(const biz of names){
        const fn=pk(PF),ln=pk(PL);
        const email=`${fn.toLowerCase()}.${ln.toLowerCase()}.${slug}@hearth.ai`;
        const srvs=CS[cat]||[{name:"Standard Service",price:499,pt:"fixed" as const}];
        const u=await User.create({email,password:"Provider@123",firstName:fn,lastName:ln,phone:`+91${ri(7000000000,9999999999)}`,role:UserRole.PROVIDER,provider:AuthProvider.LOCAL,emailVerified:true,phoneVerified:true,lastLogin:da(ri(0,5))});
        pu.push(u);
        const avgRt=rf(3.8,5.0);const revCt=ri(20,500);const jobs=ri(50,1500);
        const addr={label:"Main Location",street:`${ri(1,200)} ${pk(["MG Road","Park Street","Linking Road","Brigade Road","Anna Salai"])}`,city:city.city,state:city.state,pincode:`${ri(400000,700000)}`,coordinates:{lat:city.lat+(Math.random()-.5)*.05,lng:city.lng+(Math.random()-.5)*.05},isDefault:true};
        const p=await Provider.create({userId:u._id,businessName:biz,slug:`${slug}-${biz.toLowerCase().replace(/\s+/g,"-")}`,category:cat,subcategories:[cat],title:`Expert ${cat} — ${ri(5,20)}+ Years`,bio:`Professional ${cat.toLowerCase()} with ${ri(5,20)} years in ${city.city}.`,services:srvs.map(s=>({...s,priceType:s.pt,duration:ri(30,180),includes:["Expert","Materials","Guarantee"],isActive:true})),addresses:[addr],availability:["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"].map(d=>({day:d,slots:[{start:"09:00",end:"13:00"},{start:"14:00",end:"18:00"}],isAvailable:true})),verification:{identity:Math.random()>.2,address:Math.random()>.3,business:Math.random()>.2},ratings:{average:avgRt,count:revCt,breakdown:{5:Math.floor(revCt*.65),4:Math.floor(revCt*.2),3:Math.floor(revCt*.1),2:Math.floor(revCt*.03),1:Math.floor(revCt*.02)}},stats:{totalJobs:jobs,completedJobs:Math.floor(jobs*.85),cancelledJobs:Math.floor(jobs*.1),totalEarnings:ri(30000,1500000),responseTime:ri(1,15),onTimePercentage:ri(85,100),repeatCustomerRate:ri(30,75)},performance:{score:ri(60,98),rank:0,tier:pk(["bronze","silver","gold","platinum"] as const)},walletBalance:ri(0,50000),commission:ri(10,20),isVerified:Math.random()>.15,isFeatured:Math.random()>.6,isActive:true});
        provs.push(p);
      }
    }
    console.log(`  ${provs.length} providers (pw: Provider@123)`);

    console.log("\n📋 Creating bookings (all statuses)...");
    let bc=0;const allB:any[]=[];
    for(const cust of custs){
      for(let i=0;i<ri(5,12);i++){
        const p=pk(provs),s=pk(p.services),dt=da(ri(1,90)),tot=Math.round(s.price*1.07);
        const b=await Booking.create({bookingId:bid(),customerId:cust._id,providerId:p._id,service:{name:s.name,category:p.category,price:s.price,priceType:s.priceType,duration:s.duration},type:BookingType.SCHEDULED,status:BookingStatus.COMPLETED,paymentStatus:PaymentStatus.PAID,address:p.addresses[0],scheduled:{date:dt,startTime:`${ri(9,17)}:${pk(["00","30"])}`},pricing:{subtotal:s.price,discount:ri(0,100),tax:Math.round(tot*.05),platformFee:Math.round(tot*.02),total:tot,currency:"INR"},payment:{method:pk(["upi","card","wallet"]),razorpayOrderId:`ord_${uuidv4().slice(0,10)}`,razorpayPaymentId:`pay_${uuidv4().slice(0,10)}`,paidAt:dt},timeline:[{status:"pending",timestamp:new Date(dt.getTime()-86400000)},{status:"accepted",timestamp:new Date(dt.getTime()-3600000)},{status:"started",timestamp:dt},{status:"completed",timestamp:new Date(dt.getTime()+3600000)}],tracking:{startedAt:dt,completedAt:new Date(dt.getTime()+3600000)}});
        allB.push(b);bc++;
      }
      const STAT=[BookingStatus.PENDING,BookingStatus.ACCEPTED,BookingStatus.ASSIGNED,BookingStatus.ON_THE_WAY,BookingStatus.STARTED];
      for(let i=0;i<ri(2,5);i++){
        const p=pk(provs),s=pk(p.services),st=i<STAT.length?STAT[i]:pk(STAT),dt2=i===0?new Date():df(ri(0,5)),tot2=Math.round(s.price*1.07);
        const b=await Booking.create({bookingId:bid(),customerId:cust._id,providerId:p._id,service:{name:s.name,category:p.category,price:s.price,priceType:s.priceType,duration:s.duration},type:pk([BookingType.SCHEDULED,BookingType.INSTANT,BookingType.EMERGENCY]),status:st,paymentStatus:st===BookingStatus.PENDING?PaymentStatus.PENDING:PaymentStatus.PAID,address:p.addresses[0],scheduled:{date:dt2,startTime:`${ri(9,17)}:${pk(["00","30"])}`},pricing:{subtotal:s.price,discount:0,tax:Math.round(tot2*.05),platformFee:Math.round(tot2*.02),total:tot2,currency:"INR"},payment:st!==BookingStatus.PENDING?{method:pk(["upi","card"]),razorpayOrderId:`ord_${uuidv4().slice(0,10)}`}:{method:"pending"},timeline:[{status:"pending",timestamp:da(ri(0,3))},...(st!==BookingStatus.PENDING?[{status:st,timestamp:new Date()}]:[])],tracking:{statusHistory:[{status:st,timestamp:new Date()}]}});
        allB.push(b);bc++;
      }
      for(let i=0;i<ri(1,3);i++){
        const p=pk(provs),s=pk(p.services),dt3=da(ri(3,30)),isRef=Math.random()>.4,tot3=Math.round(s.price*1.07);
        const b=await Booking.create({bookingId:bid(),customerId:cust._id,providerId:p._id,service:{name:s.name,category:p.category,price:s.price,priceType:s.priceType,duration:s.duration},type:BookingType.SCHEDULED,status:isRef?BookingStatus.REFUNDED:BookingStatus.CANCELLED,paymentStatus:isRef?PaymentStatus.REFUNDED:PaymentStatus.PAID,address:p.addresses[0],scheduled:{date:dt3,startTime:`${ri(9,17)}:00`},pricing:{subtotal:s.price,discount:0,tax:Math.round(tot3*.05),platformFee:Math.round(tot3*.02),total:tot3,currency:"INR"},cancellation:{reason:pk(["Schedule conflict","Found another","Not needed","Emergency"]),cancelledBy:pk(["customer","provider"]),cancelledAt:da(ri(1,3)),refundEligible:isRef},timeline:[{status:"pending",timestamp:da(10)},{status:"cancelled",timestamp:da(ri(1,3))}]});
        allB.push(b);bc++;
      }
    }
    const completedCt=allB.filter((b:any)=>b.status===BookingStatus.COMPLETED).length;
    const activeCt=allB.filter((b:any)=>![BookingStatus.COMPLETED,BookingStatus.CANCELLED,BookingStatus.REFUNDED].includes(b.status)).length;
    const cancelledCt=allB.filter((b:any)=>[BookingStatus.CANCELLED,BookingStatus.REFUNDED].includes(b.status)).length;
    console.log(`  ${bc} bookings (${completedCt} completed, ${activeCt} active, ${cancelledCt} cancelled)`);

    console.log("\n⭐ Creating reviews...");
    let rc2=0;const compB=allB.filter((b:any)=>b.status===BookingStatus.COMPLETED);
    for(const b of compB.slice(0,70)){
      if(Math.random()>.75)continue;
      const rating=ri(3,5);
      const comments=["Excellent service! Very professional and punctual.","Great work, highly recommended!","Best service I've used. Professional and clean.","Outstanding quality. Fixed everything perfectly.","Very happy. Polite, skilled, and spotless.","Decent but arrived 30 mins late.","Average experience. Could be more professional.","Okay but pricing was higher than quoted."];
      const comment=pk(comments);
      const hasReply=Math.random()>.35;
      await Review.create({bookingId:b._id,customerId:b.customerId,providerId:b.providerId,rating,title:rating>=4?pk(["Great!","Excellent","Highly Recommended"]):pk(["Okay","Could Improve"]),comment,status:"published",helpfulVotes:{count:ri(0,25),voters:[]},...(hasReply?{providerReply:{comment:pk(["Thank you! 🙏","Thanks for the review!","Appreciate it!"]),repliedAt:da(ri(0,5))}}:{})});
      rc2++;
    }
    console.log(`  ${rc2} reviews (with replies)`);

    console.log("\n💰 Creating wallets with transaction history...");
    let wc2=0;const walletUsers=[...custs,...pu];
    for(const u of walletUsers){
      let bal=0;const txs:any[]=[];
      const add=(type:WalletTransactionType,amt:number,desc:string,ago:number)=>{txs.push({transactionId:`TXN-${uuidv4().slice(0,8).toUpperCase()}`,type,amount:amt,balanceBefore:bal,balanceAfter:bal+amt,description:desc,status:"success",createdAt:da(ago)});bal+=amt};
      const sub=(type:WalletTransactionType,amt:number,desc:string,ago:number)=>{if(bal>=amt){txs.push({transactionId:`TXN-${uuidv4().slice(0,8).toUpperCase()}`,type,amount:amt,balanceBefore:bal,balanceAfter:bal-amt,description:desc,status:"success",createdAt:da(ago)});bal-=amt}};
      add(WalletTransactionType.RECHARGE,ri(100,2000),"Welcome bonus",ri(30,60));
      for(let i=0;i<ri(2,6);i++)add(WalletTransactionType.CASHBACK,ri(25,250),"Cashback on booking",ri(1,45));
      if(Math.random()>.4)add(WalletTransactionType.REFERRAL,ri(100,500),"Referral reward",ri(5,30));
      if(u.role===UserRole.PROVIDER)for(let i=0;i<ri(0,3);i++)sub(WalletTransactionType.WITHDRAWAL,ri(200,Math.max(201,bal-50)),"Withdrawal",ri(1,20));
      await Wallet.create({userId:u._id,balance:bal,currency:"INR",transactions:txs});wc2++;
    }
    console.log(`  ${wc2} wallets`);

    console.log("\n🔔 Creating notifications...");
    let nc2=0;
    const cn=[{t:"booking_confirmed",tl:"Booking Confirmed",b:"Your booking has been confirmed.",r:false},{t:"upcoming",tl:"Upcoming Booking",b:"Reminder: AC Repair tomorrow at 10AM.",r:false},{t:"offer",tl:"20% Off!",b:"Use code HEARTH20 for 20% off.",r:false},{t:"cashback",tl:"Cashback Earned",b:"You earned ₹75 cashback!",r:true},{t:"tip",tl:"Pro Tip",b:"Track your pro in real-time from your booking.",r:true}];
    const pn=[{t:"new_booking",tl:"New Booking!",b:"You have a new booking request.",r:false},{t:"earnings",tl:"Weekly Earnings",b:"You earned ₹4,250 this week.",r:true},{t:"review",tl:"New Review ⭐",b:"You got a 5-star review!",r:true}];
    for(const cust of custs)for(const n of cn){if(Math.random()>.6)continue;await Notification.create({recipientId:cust._id,type:n.t,title:n.tl,body:n.b,channels:[NotificationChannel.IN_APP],status:{inApp:n.r?"read":"unread"},isRead:n.r,readAt:n.r?da(ri(0,3)):undefined,createdAt:da(ri(0,15))});nc2++}
    for(const pr of pu.slice(0,15))for(const n of pn){if(Math.random()>.5)continue;await Notification.create({recipientId:pr._id,type:n.t,title:n.tl,body:n.b,channels:[NotificationChannel.IN_APP],status:{inApp:n.r?"read":"unread"},isRead:n.r,createdAt:da(ri(0,10))});nc2++}
    console.log(`  ${nc2} notifications`);

    console.log("\n💬 Creating chat rooms...");
    let chc2=0;const activeB2=allB.filter((b:any)=>[BookingStatus.ACCEPTED,BookingStatus.ASSIGNED,BookingStatus.ON_THE_WAY,BookingStatus.STARTED].includes(b.status));
    for(const b of activeB2.slice(0,15)){await ChatRoom.create({participants:[b.customerId,b.providerId],bookingId:b._id,lastMessage:{senderId:b.customerId,content:pk(["Hi, what time will you arrive?","I'll be there by 10 AM.","Great, thank you!"]),type:"text",sentAt:da(ri(0,2))},unreadCount:new Map([[b.customerId.toString(),ri(0,2)],[b.providerId.toString(),ri(0,2)]]),isArchived:false});chc2++}
    console.log(`  ${chc2} chat rooms`);

    console.log("\n"+"=".repeat(60));
    console.log("🎉 HEARTH AI DEMO DATA SEED COMPLETE!");
    console.log("=".repeat(60));
    console.log(`\n📊 Summary:`);
    console.log(`  👤 ${1+custs.length+pu.length} users | 🔧 ${provs.length} providers`);
    console.log(`  📋 ${bc} bookings | ⭐ ${rc2} reviews | 💰 ${wc2} wallets`);
    console.log(`  🔔 ${nc2} notifications | 💬 ${chc2} chats`);
    console.log(`\n🔑 Login: admin@hearth.ai / Admin@123456`);
    console.log(`🚀 Ready to showcase! Run: npm run seed:demo`);

    await mongoose.disconnect();process.exit(0);
  }catch(e){console.error("Seed failed:",e);await mongoose.disconnect();process.exit(1);}
}
seed();