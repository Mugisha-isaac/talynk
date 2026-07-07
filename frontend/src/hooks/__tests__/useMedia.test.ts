import { renderHook, act, waitFor } from '@testing-library/react';
import { useMedia } from '@/hooks/useMedia';

class FakeXHR {
  static instances: FakeXHR[] = [];

  upload = { addEventListener: jest.fn() };
  listeners: Record<string, ((...args: unknown[]) => void)[]> = {};
  status = 0;
  responseText = '';
  open = jest.fn();
  send = jest.fn();

  constructor() {
    FakeXHR.instances.push(this);
  }

  addEventListener(event: string, cb: (...args: unknown[]) => void) {
    this.listeners[event] = this.listeners[event] || [];
    this.listeners[event].push(cb);
  }

  triggerLoad(status: number, body: unknown) {
    this.status = status;
    this.responseText = JSON.stringify(body);
    this.listeners['load']?.forEach((cb) => cb());
  }

  triggerError() {
    this.listeners['error']?.forEach((cb) => cb());
  }
}

beforeEach(() => {
  FakeXHR.instances = [];
  // @ts-expect-error - overriding global for test purposes
  global.XMLHttpRequest = FakeXHR;
  global.fetch = jest.fn();
});

describe('useMedia', () => {
  it('resolves uploadMedia when the XHR reports a 201', async () => {
    const { result } = renderHook(() => useMedia());
    const file = new File(['content'], 'photo.png', { type: 'image/png' });

    let uploadPromise: Promise<unknown>;
    act(() => {
      uploadPromise = result.current.uploadMedia(file, {
        title: 'My photo',
        description: 'desc',
        category: 'photography',
        tags: [],
      });
    });

    await waitFor(() => expect(FakeXHR.instances).toHaveLength(1));

    const xhr = FakeXHR.instances[0];
    act(() => {
      xhr.triggerLoad(201, { data: { id: 'media-1' } });
    });

    const uploaded = await uploadPromise!;
    expect(uploaded).toEqual({ id: 'media-1' });
    expect(xhr.open).toHaveBeenCalledWith('POST', '/api/media/upload');
  });

  it('rejects uploadMedia when the XHR reports a non-201 status', async () => {
    const { result } = renderHook(() => useMedia());
    const file = new File(['content'], 'clip.mp4', { type: 'video/mp4' });

    let uploadPromise: Promise<unknown>;
    act(() => {
      uploadPromise = result.current.uploadMedia(file, {
        title: 't',
        description: 'd',
        category: 'video',
        tags: [],
      });
    });

    await waitFor(() => expect(FakeXHR.instances).toHaveLength(1));

    act(() => {
      FakeXHR.instances[0].triggerLoad(500, {});
    });

    await expect(uploadPromise!).rejects.toThrow('Upload failed');
  });

  it('deletes media successfully', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({ ok: true });

    const { result } = renderHook(() => useMedia());

    await act(async () => {
      const success = await result.current.deleteMedia('media-1');
      expect(success).toBe(true);
    });

    expect(global.fetch).toHaveBeenCalledWith('/api/media/media-1', { method: 'DELETE' });
  });

  it('sets an error and rejects when delete fails', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({ ok: false });

    const { result } = renderHook(() => useMedia());

    await act(async () => {
      await expect(result.current.deleteMedia('media-1')).rejects.toThrow(
        'Failed to delete media'
      );
    });

    expect(result.current.error).toBe('Failed to delete media');
  });
});
