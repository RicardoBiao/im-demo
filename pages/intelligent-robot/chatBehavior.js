/*
 * @Author: liweibiao
 * @Date: 2021-07-09 15:06:12
 * @LastEditTime: 2021-07-09 15:33:00
 * @Description: 
 */



// 文件系统管理器
let fsm = wx.getFileSystemManager();

export const chatBehavior = Behavior({
	data: {
		// 下载到本地处理过的文件列表
		_fileList: [],
	},

	methods: {

		// 根据id下载文件并返回url
		async _getFileUrlForId(fls) {
			// 文件路径
			let filePath = wx.env.USER_DATA_PATH + "/hsz_robot_ans_files";
			// 创建目录
			try {
				fsm.accessSync(filePath);
			} catch (e) {
				fsm.mkdirSync(filePath);
			}

			let _fileArr = [];

			for (let fl of fls) {
				let name = fl.ans_file_name;
				// TODO: 如果name没有文件类型后缀就要处理一下。

				try {
					// 文件本地已存在，直接获取文件本地路径
					fsm.accessSync(`${filePath}/${name}`);
				} catch (e) {
					// 文件本地不存在，则下载保存再获取本地路径
					// let res = await API.download({
					// 	id: fl.ans_file_id,
					// 	isSlt: 0,
					// }, true);
					// console.log(res);
					// fsm.writeFileSync(`${filePath}/${name}`, res.data, 'utf8');
				} finally {
					_fileArr.push({
						fileId: fl.ans_file_id,
						name: fl.ans_file_name,
						// url: `${filePath}/${name}`,
						// TODO: 待切换正常路径
						url: 'https://ricardo-bucket.oss-cn-hangzhou.aliyuncs.com/%E6%88%91%E6%98%AF%E6%93%8D%E4%BD%9C%E6%89%8B%E5%86%8C.pdf'
					});
				}
			}
			return Promise.resolve(_fileArr);
		},

		// 打开文件
		_openDocument(file) {
			console.log('_openDocument===>', file)
			let filePath = `${wx.env.USER_DATA_PATH}/hsz_robot_ans_files/${file.name}`;
			try {
				// 文件本地已存在，直接获取文件本地路径
				fsm.accessSync(filePath);
			} catch (e) {
				// 文件本地不存在，则下载保存再获取本地路径
				wx.downloadFile({
					url: file.url,
					filePath: filePath, // 本地存储路径
					success(res) {
					  console.log('downloadFile-res ===>', res)
					  if (res.statusCode === 200) {
						// 打开文档
						wx.openDocument({
							filePath: res.filePath,
							success: function (res) {
							  console.log('打开文档成功',filePath)
							}
						})
					  }
					},
					fail(err) {
					  console.log('downloadFile-err ===>', err)
					},
				})
			}
			// 打开文档
			wx.openDocument({
				filePath: filePath,
				success: function (res) {
				  console.log('打开文档成功',filePath)
				}
			})
		},
	}
})
