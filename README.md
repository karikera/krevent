```ts

import Event from 'krevent';

const evs = new Event<(v1:number, v2:string)=>void>();

// attach event listener
evs.on((v1, v2)=>{ console.log(v1, v2); });

// fire event
evs.fire(1234, 'string');

```