const routes = [
  {
    path: '/login',
    layout: false,
    routes: [
      {
        name: 'login',
        path: '/login',
        component: './login',
      },
      {
        path: '/login/success',
        component: './login/success',
      },
    ],
  },
  {
    hideInMenu: true,
    name: 'payment',
    path: '/payment',
    component: './payment/Payment',
  },
  {
    hideInMenu: true,
    name: 'paymentSuccess',
    path: '/payment/success',
    component: './payment/Success',
  },
  {
    hideInMenu: true,
    name: 'paymentCancel',
    path: '/payment/cancel',
    component: './payment/Cancel',
  },
  {
    hideInMenu: true,
    name: 'upload',
    path: '/cloud/upload',
    component: './cloud/Upload',
  },
  {
    hideInMenu: true,
    name: 'uploadPhoto',
    path: '/cloud/upload-photo',
    component: './cloud/UploadPhoto',
  },
  {
    hideInMenu: true,
    name: 'userWizard',
    path: '/user/wizard',
    component: './user/wizard',
  },
  {
    path: '/',
    name: 'welcome',
    icon: 'smile',
    component: './Welcome',
  },
  {
    path: '/cloud',
    name: 'cloud',
    icon: 'cloud',
    component: './cloud/Cloud',
  },
  {
    path: '/coil-calculator',
    name: 'coil-calculator',
    icon: 'https://web.vapetool.app/menu_icons/menu_coil_calculator.svg',
    component: './coil/CoilCalculator',
  },
  {
    path: '/liquid-blender',
    name: 'liquid-blender',
    icon: 'https://web.vapetool.app/menu_icons/menu_liquid_blender.svg',
    component: './liquid/LiquidBlender',
  },
  {
    path: '/mixer',
    name: 'mixer',
    icon: 'https://web.vapetool.app/menu_icons/menu_liquid_blender.svg',
    component: './mixer/Mixer',
  },
  {
    path: '/ohm-law',
    name: 'ohm-law',
    icon: `https://web.vapetool.app/menu_icons/menu_ohm_law.svg`,
    component: './ohm/OhmLaw',
  },
  {
    path: '/batteries',
    name: 'batteries',
    icon: 'https://web.vapetool.app/menu_icons/menu_batteries.svg',
    component: './batteries/Batteries',
  },
  {
    path: '/converters',
    name: 'converters',
    icon: 'https://web.vapetool.app/menu_icons/menu_converters.svg',
    component: './converters/Converters',
  },
  {
    path: '/battery-life',
    name: 'battery-life',
    icon: 'https://web.vapetool.app/menu_icons/menu_battery_life.svg',
    component: './batterylife/BatteryLife',
  },
  // {
  //   path: '/knowledge',
  //   name: 'knowledge',
  //   icon: 'https://web.vapetool.app//menu_icons/menu_knowledge_zone.svg',
  //   component: './knowledge/Knowledge',
  // },
  {
    name: 'center',
    icon: 'user',
    path: '/user/profile',
    exact: true,
    access: 'isNotAnonymous',
    component: './user/profile',
  },
  {
    name: 'center',
    icon: 'user',
    path: '/user/profile/:id',
    hideInMenu: true,
    component: './user/profile/[id]',
  },
  // {
  //   hideInMenu: true,
  //   name: 'profile',
  //   icon: 'user',
  //   path: '/user/profile/:id',
  //   component: './user/profile',
  // },
  {
    hideInMenu: true,
    path: '/oops',
    component: './Oops',
  },
  {
    component: './404',
  },
];

export default routes;
