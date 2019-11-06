
import '@mcbe/dummy-console';

export interface CapsuledEvent<T extends (...args:any[])=>(boolean|void)>
{
    isEmpty():boolean;
    on(listener:T):void;
    onBefore(listener:T, needle:T):void;
    onAfter(listener:T, needle:T):void;
    remove(listener:T):boolean;
}

export default class Event<T extends (...args:any[])=>(boolean|void)> implements CapsuledEvent<T>
{
    private readonly listeners:T[] = [];

    isEmpty():boolean
    {
        return this.listeners.length === 0;
    }

    on(listener:T):void
    {
        this.listeners.push(listener);
    }

    onBefore(listener:T, needle:T):void
    {
        const idx = this.listeners.indexOf(needle);
        if (idx === -1) throw Error('needle not found');
        this.listeners.splice(idx, 0, listener);
    }

    onAfter(listener:T, needle:T):void
    {
        const idx = this.listeners.indexOf(needle);
        if (idx === -1) throw Error('needle not found');
        this.listeners.splice(idx+1, 0, listener);
    }

    remove(listener:T):boolean
    {
        const idx = this.listeners.indexOf(listener);
        if (idx === -1) return false;
        this.listeners.splice(idx, 1);
        return true;
    }

    fire(...v:T extends (...args:infer ARGS)=>any ? ARGS : never):boolean
    {
        for (const listener of this.listeners)
        {
            try
            {
                if (listener(...v)) return true;
            }
            catch (err)
            {
                console.error(err);
            }
        }
        return false;
    }
}

export class EventEx<T extends (...args:any[])=>(boolean|void)> extends Event<T>
{
    protected onStarted():void{}
    protected onCleared():void{}

    on(listener:T):void
    {
        if (this.isEmpty()) this.onStarted();
        super.on(listener);
    }
    remove(listener:T):boolean
    {
        if (!this.remove(listener)) return false;
        if (this.isEmpty()) this.onCleared();
        return true;
    }
};
