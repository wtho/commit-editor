import { NotificationSubject } from "./observable"


describe('observable.ts', () => {

  test('subject should notify a subscriber', () => {
    const subject = new NotificationSubject()
    const subscriber = jest.fn()
    subject.subscribe(subscriber)

    subject.notify('hello subscriber')

    expect(subscriber).toHaveBeenCalled()
    expect(subscriber).toHaveBeenCalledTimes(1)
    expect(subscriber).toHaveBeenNthCalledWith(1, 'hello subscriber')
  })

  test('subject should notify multiple subscribers', () => {
    const subject = new NotificationSubject()
    const observable = subject.observable

    const subscriber1 = jest.fn()
    subject.subscribe(subscriber1)

    const subscriber2 = jest.fn()
    observable.subscribe(subscriber2)

    subject.notify('msg 1')

    const subscriber3 = jest.fn()
    subject.subscribe(subscriber3)

    subject.notify('msg 2')
    subject.notify('msg 3')

    expect(subscriber1).toHaveBeenCalledTimes(3)
    expect(subscriber1).toHaveBeenNthCalledWith(1, 'msg 1')
    expect(subscriber1).toHaveBeenNthCalledWith(2, 'msg 2')
    expect(subscriber1).toHaveBeenNthCalledWith(3, 'msg 3')

    expect(subscriber2).toHaveBeenCalledTimes(3)
    expect(subscriber2).toHaveBeenNthCalledWith(1, 'msg 1')
    expect(subscriber2).toHaveBeenNthCalledWith(2, 'msg 2')
    expect(subscriber2).toHaveBeenNthCalledWith(3, 'msg 3')

    expect(subscriber3).toHaveBeenCalledTimes(2)
    expect(subscriber3).toHaveBeenNthCalledWith(1, 'msg 2')
    expect(subscriber3).toHaveBeenNthCalledWith(2, 'msg 3')
  })

})